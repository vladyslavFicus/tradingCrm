def service = 'backoffice'

properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10'))])

node('build') {
    stage('checkout') {
        checkout scm
        env.GIT_COMMIT_MESSAGE = sh returnStdout: true, script: 'git log --oneline -1'
    }

    docker.image('kkarczmarczyk/node-yarn:6.7').inside('-v /home/jenkins:/home/jenkins') {
        stage('Test') {
            sh '''
                export HOME=/home/jenkins
                yarn
                yarn test:jenkins
            '''

            junit testResults: "tests/test-results.xml"
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
        sh "docker push devregistry.newage.io/hrzn/${service}:latest"
        sh "docker rmi devregistry.newage.io/hrzn/${service}:latest"
    }

    stage('deploy') {
        if (env.BRANCH_NAME == 'master' && !env.GIT_COMMIT_MESSAGE.contains("[skip deploy]")) {
            build(job: 'casino-deploy-dev', wait: false,
                parameters: [string(name: 'service', value: service),
                    booleanParam(name: 'skipRelease', value: true)])
        }
    }
}
