def service = 'backoffice'

properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10'))])

node('build') {    

    stage('Checkout') {         
        checkout scm     
        env.GIT_COMMIT_MESSAGE = sh returnStdout: true, script: 'git log --oneline -1'    
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
    
    stage('Assemble') {         
        sh "docker build -t nas/$service ."
        sh "docker tag nas/$service registry.app/nas/$service"
        sh "docker push registry.app/nas/$service"
    }      
    
    stage('Deploy') {        
        if (env.BRANCH_NAME == 'master' && !env.GIT_COMMIT_MESSAGE.contains("[skip deploy]")) {
            build job: 'casino-platform/casino-orchestra/master', wait: false, 
                parameters: [string(name: 'env', value: 'dev2'), string(name: 'service', value: service), string(name: 'version', value: 'latest')]
        }
    } 
}
