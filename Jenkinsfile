@NonCPS
def lastCommit() {
    def changeLogSets = currentBuild.changeSets
    if (changeLogSets.size() > 0 && changeLogSets.last().items.size() > 0) {
        return [changeLogSets.last().items.last().msg, changeLogSets.last().items.last().commitId]
    }
    return ["", ""]
}


def service = 'backoffice'

properties([
    buildDiscarder(logRotator(artifactDaysToKeepStr: '', artifactNumToKeepStr: '', daysToKeepStr: '', numToKeepStr: '10')),
    parameters([
        booleanParam(name: 'skipTest', description: 'Skip Test', defaultValue: false),
        booleanParam(name: 'skipDeploy', description: 'Skip Deploy', defaultValue: false)
    ])
])

node('build') {
    stage('checkout') {
        checkout scm
    }

    def lastCommit = lastCommit()

    def thisJobParams = [skipTest: lastCommit[0].contains("[skip test]") ?: params.skipTest,
                     skipDeploy: lastCommit[0].contains("[skip deploy]") ?: params.skipDeploy]

    def isBuildDocker = env.BRANCH_NAME == 'master' && !thisJobParams.skipDeploy

      docker.image('node:9').inside('-v /home/jenkins:/home/jenkins') {
        stage('install dependencies') {
            sh """
              yarn add --force node-sass
              export HOME=/home/jenkins
              yarn
            """
        }

        stage('test') {
            if (!thisJobParams.skipTest) {
                try {
                    sh """export HOME=/home/jenkins
yarn test:jenkins
"""
                } catch (Exception e) {
                    throw e
                } finally {
                    junit testResults: "tests/test-results.xml"
                }
            }
        }

        stage('build') {
            sh """
              export HOME=/home/jenkins
              yarn build
            """
        }

        stage('sentry release') {
            sh '''
                export HOME=/home/jenkins
                yarn sentry-release
            '''
        }
    }

    stage('assemble') {
        println "@@@@ ${isBuildDocker}"
        if (isBuildDocker) {
            def commitId = sh(script: 'git rev-parse HEAD', returnStdout: true)
            println "@@@@ ${commitId}"
            sh """docker build --label "org.label-schema.name=${service}" \
--label "org.label-schema.vendor=New Age Solutions" \
--label "org.label-schema.schema-version=1.0" \
--label "org.label-schema.vcs-ref=${commitId}" \
-t devregistry.newage.io/hrzn/${service}:latest .
"""
        }
    }

    stage('upload') {
        if (isBuildDocker) {
            sh "docker push devregistry.newage.io/hrzn/${service}:latest"
            sh "docker rmi devregistry.newage.io/hrzn/${service}:latest"
        }
    }

    stage('deploy') {
        if (isBuildDocker && !jenkins.model.Jenkins.instance.getItemByFullName('casino-deploy-dev').disabled) {
            build(job: 'casino-deploy-dev', wait: false, parameters: [string(name: 'service', value: service)])
        }
    }
}
