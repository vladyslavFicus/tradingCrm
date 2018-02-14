def service = 'backoffice'

properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10'))])

node('build') {
    stage('checkout') {
        checkout scm
    }

    docker.image('kkarczmarczyk/node-yarn:6.7').inside('-v /home/jenkins:/home/jenkins') {
        stage('Test') {
            try {
                sh '''
                    export HOME=/home/jenkins
                    yarn
                    yarn test:jenkins
                '''

                junit testResults: "tests/test-results.xml"
            } catch (Exception e) {
                junit testResults: "tests/test-results.xml"
                throw e
            }
        }

        stage('Build') {
            sh '''
                export HOME=/home/jenkins
                yarn build
            '''
        }
    }

    stage('assemble') {
        sh "docker build -t devregistry.newage.io/hrzn/${service}:latest ."
    }
    
    stage('upload') {
        sh "docker push devregistry.newage.io/hrzn/${service}:latest"
        sh "docker rmi devregistry.newage.io/hrzn/${service}:latest"
    }

    stage('deploy') {
        if (!jenkins.model.Jenkins.instance.getItemByFullName('casino-deploy-dev').disabled) {
            build(job: 'casino-deploy-dev', wait: false, parameters: [string(name: 'service', value: service)])
        }
    }
}
