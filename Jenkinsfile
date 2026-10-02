pipeline {
  agent any
  environment {
    IMAGE_PREFIX = credentials('dockerhub-repository')
    IMAGE_TAG = "${env.BUILD_NUMBER}"
  }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Test') {
      steps { dir('backend') { sh 'npm ci && npm run test:coverage' } }
      post { always { junit 'backend/junit.xml', allowEmptyResults: true; publishHTML(target: [allowMissing: true, reportDir: 'backend/coverage/lcov-report', reportFiles: 'index.html', reportName: 'Coverage']) } }
    }
    stage('SonarQube') { steps { withSonarQubeEnv('sonarqube') { sh 'sonar-scanner -Dsonar.projectKey=tablebite -Dsonar.sources=backend,frontend' } } }
    stage('Build') { steps { sh 'docker build -t $IMAGE_PREFIX/backend:$IMAGE_TAG backend && docker build -t $IMAGE_PREFIX/frontend:$IMAGE_TAG frontend' } }
    stage('Trivy') { steps { sh 'trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE_PREFIX/backend:$IMAGE_TAG && trivy image --exit-code 1 --severity HIGH,CRITICAL $IMAGE_PREFIX/frontend:$IMAGE_TAG' } }
    stage('Push') { steps { withDockerRegistry([credentialsId: 'dockerhub-credentials', url: '']) { sh 'docker push $IMAGE_PREFIX/backend:$IMAGE_TAG && docker push $IMAGE_PREFIX/frontend:$IMAGE_TAG' } } }
  }
}
pipeline {
  agent any
  environment { IMAGE = "tarunsehrawat0/qr-backend" }
  stages {
    stage('Checkout') { steps { checkout scm } }
    stage('Build')    { steps { dir('backend') { sh 'npm ci' } } }
    stage('Test')     { steps { dir('backend') { sh 'npm test' } } }
    stage('Docker build') {
      steps { sh 'docker build -t $IMAGE:$BUILD_NUMBER ./backend' }
    }
    stage('Security scan') {
      steps { sh 'docker run --rm -v /var/run/docker.sock:/var/run/docker.sock aquasec/trivy image --exit-code 0 $IMAGE:$BUILD_NUMBER' }
    }
    stage('Push') {
      steps {
        withCredentials([usernamePassword(credentialsId: 'dockerhub', usernameVariable: 'U', passwordVariable: 'P')]) {
          sh 'echo $P | docker login -u $U --password-stdin && docker push $IMAGE:$BUILD_NUMBER'
        }
      }
    }
  }
}