def service = 'backoffice'

properties([buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10'))])

node('build') {

    stage('checkout') {
        checkout scm
        env.GIT_COMMIT_MESSAGE = sh returnStdout: true, script: 'git log --oneline -1'
    }

    docker.image('kkarczmarczyk/node-yarn:6.7').inside('-v /home/jenkins:/home/jenkins') {
        env.CONFIG_ENV = 'test'
        stage('Build') {
            sh '''
export HOME=/home/jenkins
yarn
npm run build
'''
        }
    }

    stage('assemble') {
        sh "docker build -t registry.app/nas/$service:latest ."
        sh "docker push registry.app/nas/${service}:latest"
    }

    stage('deploy') {
        if (env.BRANCH_NAME == 'master' && !env.GIT_COMMIT_MESSAGE.contains("[skip deploy]")) {
            build(job: 'casino-deploy-dev', wait: false,
                parameters: [string(name: 'service', value: service),
                    booleanParam(name: 'skipRelease', value: true)])
        }
    }
}
