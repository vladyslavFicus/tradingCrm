node('build') {     
    stage('Checkout') {         
        checkout scm     
    }      
    
    docker.image('kkarczmarczyk/node-yarn').inside {         
        env.CONFIG_ENV = 'test'         
        stage('Build') {             
            sh 'yarn'             
            sh 'npm run deploy:prod'         
        }     
    }      
    
    stage('Docker') {         
        sh 'docker build -t nas/manager .'         
        sh 'docker tag nas/website registry.app/nas/manager'         
        sh 'docker push registry.app/nas/manager'     
    }      
    
    stage('Deploy') {         
        build job: 'casino-qa-deploy', wait: false, parameters: [string(name: 'service', value: 'manager')]     
    } 
}
