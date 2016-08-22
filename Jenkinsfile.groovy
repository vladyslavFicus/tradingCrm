node {
    stage 'Checkout'
    checkout scm

    env.CONFIG_ENV = 'test'
    stage 'Build And Test'
    def node = tool name: 'nodejs', type: 'jenkins.plugins.nodejs.tools.NodeJSInstallation'
    env.PATH = "$node/bin:${env.PATH}"
    sh "./gradlew npmInstall npmDeploy"

    stage 'Docker'
    sh './gradlew dockerBuild dockerTag dockerPush -PdockerUrl=http://172.17.0.1:2376'

    stage 'Deploy'
    build job: 'NAS QA Deploy', wait: false, parameters: [string(name: 'service', value: 'manager')]
}
