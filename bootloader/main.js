var auth = require('./auth')

function main(){
    console.log('Booting server...\n')
    console.log('Creating GCP key...\n')
    auth.createKey()
}

if (require.main === module){
    main()
}
