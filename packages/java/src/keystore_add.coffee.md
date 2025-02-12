
# `nikita.java.keystore_add`

Add certificates, private keys and certificate authorities to java keystores
and truststores.

## CA Cert Chains

In case the CA file reference a chain of certificates, each certificate will be
referenced by a unique incremented alias, starting at 0. For example if the 
alias value is "my-alias", the aliases will be "my-alias-0" then "my-alias-1"... 

## Relevant Java properties

* `javax.net.ssl.trustStore`
* `javax.net.ssl.trustStorePassword`
* `javax.net.ssl.keyStore`
* `javax.net.ssl.keyStoreType`
* `javax.net.ssl.keyStorePassword`

## Relevant commands

* View the content of a Java KeyStore (JKS) and Java TrustStore:   
  `keytool -list -v -keystore $keystore -storepass $storepass`   
  `keytool -list -v -keystore $keystore -storepass $storepass -alias $caname`   
  Note, alias is optional and may reference a CA or a certificate
* View the content of a ".pem" certificate:   
  `openssl x509 -in cert.pem -text`   
  `keytool -printcert -file certs.pem`   
* Change the password of a keystore:   
  `keytool -storepasswd -keystore my.keystore`
* Change the key's password:   
  `keytool -keypasswd -alias <key_name> -keystore my.keystore`

## Uploading public and private keys into a keystore

```js
const {$status} = await nikita.java.keystore_add([{
  keystore: java_home + '/lib/security/cacerts',
  storepass: 'changeit',
  caname: 'my_ca_certificate',
  cacert: '/tmp/cacert.pem',
  key: "/tmp/private_key.pem",
  cert: "/tmp/public_cert.pem",
  keypass: 'mypassword',
  name: 'node_1'
})
console.info(`Keystore was updated: ${$status}`)
```

## Uploading a certificate authority

```js
const {$status} = await nikita.java.keystore_add([{
  keystore: java_home + '/lib/security/cacerts',
  storepass: 'changeit',
  caname: 'my_ca_certificate',
  cacert: '/tmp/cacert.pem'
})
console.info(`Keystore was updated: ${$status}`)
```

## Requirements

This action relies on the `openssl` and `keytool` commands. If not detected
from the path, Nikita will look for "/usr/java/default/bin/keytool" which is the
default location of the Oracle JDK installation.

## Schema definitions

    definitions =
      config:
        type: 'object'
        properties:
          'cacert':
            type: 'string'
            description: '''
            Path to the certificate authority (CA).
            '''
          'cert':
            type: 'string'
            description: '''
            Path to the certificate.
            '''
          'keytool':
            type: 'string'
            default: 'keytool'
            description: '''
            Path to the `keytool` command, detetected from `$PATH` by default.
            '''
          'local':
            type: 'boolean'
            default: false
            description: '''
            Treat the source file (key, cert or cacert) as a local file present on
            the host, only apply with remote actions over SSH.
            '''
          'openssl':
            type: 'string'
            default: 'openssl'
            description: '''
            Path to OpenSSl command line tool.
            '''
          'parent':
            $ref: 'module://@nikitajs/core/lib/actions/fs/mkdir#/definitions/config/properties/parent'
          'keystore':
            type: 'string'
            description: '''
            Path to the keystore.
            '''
          'storepass':
            type: 'string'
            description: '''
            Password to manage the keystore.
            '''
        required: ['keystore', 'storepass']
        dependencies:
          'cacert':
            properties:
              'caname':
                type: 'string'
                description: '''
                Name of the certificate authority (CA).
                '''
            required: ['caname']
          'cert':
            properties:
              'key':
                type: 'string'
                description: '''
                Location of the private key.
                '''
              'keypass':
                type: 'string'
                description: '''
                Password used to protect the certigficate and its key access
                inside the keystore.
                '''
              'name':
                type: 'string'
                description: '''
                Name (aka alias) to reference the certificate inside the keystore.
                '''
            required: ['key', 'keypass', 'name']

## Handler

    handler = ({config, ssh, metadata: {tmpdir}, tools: {path}}) ->
      # Update paths in case of download
      files =
        cert: if ssh and config.local and config.cert? then "#{tmpdir}/#{path.local.basename config.cert}" else config.cert
        cacert: if ssh and config.local and config.cacert? then "#{tmpdir}/#{path.local.basename config.cacert}" else config.cacert
        key: if ssh and config.local and config.key? then "#{tmpdir}/#{path.local.basename config.key}" else config.key
      # Temporary directory
      # Used to upload certificates and to isolate certificates from their file
      if tmpdir
        await @fs.mkdir
          $shy: true
          target: tmpdir
          mode: 0o0700
      # Upload certificates
      if ssh and config.local and config.cacert
        await @file.download
          $shy: true
          source: config.cacert
          target: files.cacert
          mode: 0o0600
      if ssh and config.local and config.cert
        await @file.download
          $shy: true
          source: config.cert
          target: files.cert
          mode: 0o0600
      if ssh and config.local and config.key
        await @file.download
          $shy: true
          source: config.key
          target: files.key
          mode: 0o0600
      # Prepare parent directory
      await @fs.mkdir
        parent: config.parent
        target: path.dirname config.keystore
      # Deal with key and certificate
      try if !!config.cert
        await @execute
          bash: true
          command: """
          if ! command -v #{config.openssl}; then echo 'OpenSSL command line tool not detected'; exit 4; fi
          # Detect keytool command
          keytoolbin=#{config.keytool}
          command -v $keytoolbin >/dev/null || {
            if [ -x /usr/java/default/bin/keytool ]; then keytoolbin='/usr/java/default/bin/keytool';
            else exit 7; fi
          }
          [ -f #{files.cert} ] || (exit 6)
          user=`#{config.openssl} x509  -noout -in "#{files.cert}" -sha1 -fingerprint | sed 's/\\(.*\\)=\\(.*\\)/\\2/' | cat`
          # We are only retrieving the first certificate found in the chain with `head -n 1`
          keystore=`${keytoolbin} -list -v -keystore #{config.keystore} -storepass #{config.storepass} -alias #{config.name} | grep SHA1: | head -n 1 | sed -E 's/.+SHA1: +(.*)/\\1/'`
          echo "User Certificate: $user"
          echo "Keystore Certificate: $keystore"
          if [ "$user" = "$keystore" ]; then exit 5; fi
          # Create a PKCS12 file that contains key and certificate
          #{config.openssl} pkcs12 -export \
            -in "#{files.cert}" -inkey "#{files.key}" \
            -out "#{tmpdir}/pkcs12" -name #{config.name} \
            -password pass:#{config.keypass}
          # Import PKCS12 into keystore
          ${keytoolbin} -noprompt -importkeystore \
            -destkeystore #{config.keystore} \
            -deststorepass #{config.storepass} \
            -destkeypass #{config.keypass} \
            -srckeystore "#{tmpdir}/pkcs12" -srcstoretype PKCS12 -srcstorepass #{config.keypass} \
            -alias #{config.name}
          """
          trap: true
          code: [0, 5] # OpenSSL exit 3 if file does not exists
      catch err
        throw Error "OpenSSL command line tool not detected" if err.exit_code is 4
        throw Error "Keystore file does not exists" if err.exit_code is 6
        throw Error "Missing Requirement: command keytool is not detected" if err.exit_code is 6
        throw err
      # Deal with CACert
      try if config.cacert
        await @execute
          bash: true
          command: """
          # Detect keytool command
          keytoolbin=#{config.keytool}
          command -v $keytoolbin >/dev/null || {
            if [ -x /usr/java/default/bin/keytool ]; then keytoolbin='/usr/java/default/bin/keytool';
            else exit 7; fi
          }
          # Check password
          if [ -f #{config.keystore} ] && ! ${keytoolbin} -list -keystore #{config.keystore} -storepass #{config.storepass} >/dev/null; then
            # Keystore password is invalid, change it manually with:
            # keytool -storepasswd -keystore #{config.keystore} -storepass ${old_pasword} -new #{config.storepass}
            exit 2
          fi
          [ -f #{files.cacert} ] || (echo 'CA file doesnt not exists: #{files.cacert} 1>&2'; exit 3)
          # Import CACert
          PEM_FILE=#{files.cacert}
          CERTS=$(grep 'END CERTIFICATE' $PEM_FILE| wc -l)
          code=5
          for N in $(seq 0 $(($CERTS - 1))); do
            if [ $CERTS -eq '1' ]; then
              ALIAS="#{config.caname}"
            else
              ALIAS="#{config.caname}-$N"
            fi
            # Isolate cert into a file
            CACERT_FILE=#{tmpdir}/$ALIAS
            cat $PEM_FILE | awk "n==$N { print }; /END CERTIFICATE/ { n++ }" > $CACERT_FILE
            # Read user CACert signature
            user=`#{config.openssl} x509  -noout -in "$CACERT_FILE" -sha1 -fingerprint | sed 's/\\(.*\\)=\\(.*\\)/\\2/'`
            # Read registered CACert signature
            keystore=`${keytoolbin} -list -v -keystore #{config.keystore} -storepass #{config.storepass} -alias $ALIAS | grep SHA1: | sed -E 's/.+SHA1: +(.*)/\\1/'`
            echo "User CA Cert: $user"
            echo "Keystore CA Cert: $keystore"
            if [ "$user" = "$keystore" ]; then echo 'Identical Signature'; code=5; continue; fi
            # Remove CACert if signature doesnt match
            if [ "$keystore" != "" ]; then
              ${keytoolbin} -delete \
                -keystore #{config.keystore} \
                -storepass #{config.storepass} \
                -alias $ALIAS
            fi
            ${keytoolbin} -noprompt -import -trustcacerts -keystore #{config.keystore} -storepass #{config.storepass} -alias $ALIAS -file #{tmpdir}/$ALIAS
            code=0
          done
          exit $code
          """
          trap: true
          code: [0, 5]
      catch err
        throw Error "CA file does not exist: #{files.cacert}" if err.exit_code is 3
        throw err
      # Ensure ownerships and permissions
      if config.uid? or config.gid?
        await @fs.chown
          target: config.keystore
          uid: config.uid
          gid: config.gid
      if config.mode?
        await @fs.chmod
          target: config.keystore
          mode: config.mode
      undefined

## Exports

    module.exports =
      handler: handler
      metadata:
        tmpdir: true
        definitions: definitions
