pipeline {
    agent any

    environment {
        IMAGE_NAME = 'localbites-frontend'
        IMAGE_TAG  = "build-${BUILD_NUMBER}"
        VITE_API_URL = 'https://future-fs-03-hns9.onrender.com/api'
        CONTAINER_NAME = 'localbites-frontend-app'
        HOST_PORT = '3000'
    }

    stages {

        stage('Checkout') {
            steps {
                echo 'Cloning repository...'
                checkout scm
            }
        }

        stage('Build Docker Image') {
            steps {
                echo 'Building Docker image for frontend...'
                dir('frontend') {
                    sh """
                        docker build \
                            --build-arg VITE_API_URL=${VITE_API_URL} \
                            -t ${IMAGE_NAME}:${IMAGE_TAG} \
                            -t ${IMAGE_NAME}:latest \
                            .
                    """
                }
            }
        }

        stage('Stop Existing Container') {
            steps {
                echo 'Stopping and removing existing container if running...'
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm   ${CONTAINER_NAME} || true
                """
            }
        }

        stage('Run Container') {
            steps {
                echo 'Starting new frontend container...'
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${HOST_PORT}:80 \
                        ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Health Check') {
            steps {
                echo 'Waiting for container to be ready...'
                sh 'sleep 5'
                sh """
                    docker ps --filter name=${CONTAINER_NAME} \
                              --filter status=running \
                              --format "{{.Names}}" \
                    | grep -q ${CONTAINER_NAME} \
                    && echo "Container is running successfully" \
                    || (echo "Container failed to start" && exit 1)
                """
            }
        }

        stage('Cleanup Old Images') {
            steps {
                echo 'Removing dangling Docker images...'
                sh 'docker image prune -f'
            }
        }
    }

    post {
        success {
            echo "Deployment successful. Frontend running at http://localhost:${HOST_PORT}"
        }
        failure {
            echo 'Pipeline failed. Check logs above for details.'
            sh "docker logs ${CONTAINER_NAME} || true"
        }
    }
}
