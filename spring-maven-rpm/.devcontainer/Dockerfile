FROM centos:7

# Configure apt
RUN yum update -y \
    # Install development tools
    && yum install -y https://packages.endpoint.com/rhel/7/os/x86_64/endpoint-repo-1.7-1.x86_64.rpm && yum install -y git \
    # Install Docker CLI
    && yum install -y docker-client \
    # Install RPM Build
    && yum install -y rpm-build

# Install OpenJDK11
COPY adoptopenjdk.repo /etc/yum.repos.d/adoptopenjdk.repo
RUN yum update -y && yum install -y adoptopenjdk-11-openj9 
COPY java.sh /etc/profile.d/java.sh
RUN . /etc/profile.d/java.sh

#-------------------Uncomment the following steps to install Maven CLI Tools----------------------------------
ARG MAVEN_VERSION=3.6.3
ARG MAVEN_SHA=c35a1803a6e70a126e80b2b3ae33eed961f83ed74d18fcd16909b2d44d7dada3203f1ffe726c17ef8dcca2dcaa9fca676987befeadc9b9f759967a8cb77181c0
RUN mkdir -p /usr/share/maven /usr/share/maven/ref \
  && curl -fsSL -o /tmp/apache-maven.tar.gz https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz \
  && echo "${MAVEN_SHA} /tmp/apache-maven.tar.gz" | sha512sum -c - \
  && tar -xzf /tmp/apache-maven.tar.gz -C /usr/share/maven --strip-components=1 \
  && rm -f /tmp/apache-maven.tar.gz \
  && ln -s /usr/share/maven/bin/mvn /usr/bin/mvn
COPY maven-settings.xml /usr/share/maven/ref/
ENV MAVEN_HOME /usr/share/maven
ENV MAVEN_CONFIG /root/.m2
#-------------------------------------------------------------------------------------------------------------

# Allow for a consistant java home location for settings - image is changing over time
ENV JAVA_HOME /usr/lib/jvm/adoptopenjdk-11-openj9
RUN if [ ! -d "/docker-java-home" ]; then ln -s "${JAVA_HOME}" /docker-java-home; fi
