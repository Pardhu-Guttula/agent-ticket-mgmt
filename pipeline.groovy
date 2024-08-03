pipeline {
    agent any
    environment {
        DOCKERHUB_CREDENTIALS = credentials('dockerhub')
        DOCKER_TAG = getVersion()
    }

    stages {
        stage('SCM Checkout') {
            steps {
                git branch: 'main', credentialsId: 'Github', 
                url: 'https://github.com/Pardhu-Guttula/agent-ticket-mgmt.git'
                
            }
        }

        stage('Build FE1 docker image') {
            steps {  
                sh 'docker build -t pardhuguttula/userbot:${DOCKER_TAG} userbot/'
            }
        }
        
        stage('Build FE2 docker image') {
            steps {  
                sh 'docker build -t pardhuguttula/agentchat-fe:${DOCKER_TAG} agentchat-fe/'
            }
        }
        
        stage('Build BE docker image') {
            steps {  
                sh 'docker build -t pardhuguttula/agentchat-be:${DOCKER_TAG} agentchat-be/'
            }
        }

        stage('Login to DockerHub') {
            steps {
                sh 'echo $DOCKERHUB_CREDENTIALS_PSW | docker login -u $DOCKERHUB_CREDENTIALS_USR --password-stdin'
            }
        }

        stage('Push FE1 image') {
            steps {
                sh 'docker push pardhuguttula/userbot:${DOCKER_TAG}'
            }
        }
        
        stage('Push FE2 image') {
            steps {
                sh 'docker push pardhuguttula/agentchat-fe:${DOCKER_TAG}'
            }
        }
        stage('Push BE image') {
            steps {
                sh 'docker push pardhuguttula/agentchat-be:${DOCKER_TAG}'
            }
        }

        stage('Ansible') {
            steps {
                ansiblePlaybook credentialsId: 'dev-server', disableHostKeyChecking: true, extras: "-e DOCKER_TAG=${DOCKER_TAG}", installation: 'Ansible', inventory: 'dev.inv', playbook: 'deployment.yml', vaultTmpPath: ''
            }
        }
    }
}


def getVersion() {
    def commitHash = sh returnStdout: true, script: 'git rev-parse --short HEAD'
    
    return commitHash.trim()
}