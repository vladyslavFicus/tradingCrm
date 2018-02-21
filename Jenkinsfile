@NonCPS
def lastCommitMessage() {
    def changeLogSets = currentBuild.changeSets
    println(changeLogSets)
    if (changeLogSets.size() > 0 && changeLogSets.last().items.size() > 0) {
        println("@@@@ ${changeLogSets.last().items.last().commitId}")
    }
    return ""
}

def service = 'backoffice'

def commitMessage = lastCommitMessage()

def thisJobParams = [skipTest: commitMessage.contains("[skip test]") ?: params.skipTest,
                     skipDeploy: commitMessage.contains("[skip deploy]") ?: params.skipDeploy]

def isBuildDocker = env.BRANCH_NAME == 'master' && !thisJobParams.skipDeploy

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

    docker.image('kkarczmarczyk/node-yarn:6.7').inside('-v /home/jenkins:/home/jenkins') {
        stage('test') {
            if (!thisJobParams.skipTest) {
                try {
                    sh "export HOME=/home/jenkins && yarn && yarn test:jenkins"
                } catch (Exception e) {
                    throw e
                } finally {
                    junit testResults: "tests/test-results.xml"
                }
            }

            sh 'export HOME=/home/jenkins yarn build'
        }
    }

    stage('assemble') {
        if (isBuildDocker) {
            sh """docker build --label "org.label-schema.name=${service}" \
--label "org.label-schema.vendor=New Age Solutions" \
--label "org.label-schema.schema-version=1.0" \
--label "org.label-schema.vcs-ref=123" \
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
