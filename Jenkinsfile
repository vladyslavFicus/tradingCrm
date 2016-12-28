def service = 'backoffice'

node('build') {    

    stage('Checkout') {         
        checkout scm     
    }      
    
    docker.image('kkarczmarczyk/node-yarn:6.7').inside('-v /home/jenkins:/home/jenkins') {
        env.CONFIG_ENV = 'test'         
        
        stage('Build') {             
            sh '''
export HOME=/home/jenkins
yarn
npm run deploy:prod
'''         
        }        
    }      
    
    stage('Docker') {         
        sh "docker build -t nas/$service ."
        sh "docker tag nas/$service registry.app/nas/$service"
        sh "docker push registry.app/nas/$service"
    }      
    
    stage('Deploy') {        
        build job: 'casino-deploy', wait: false, parameters: [string(name: 'profile', value: 'dev'), string(name: 'service', value: service)]         
    } 
}
