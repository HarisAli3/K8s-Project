# Kubernetes provider (configured with cluster info from DO)
terraform {
  required_providers {
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
    helm = {
      source  = "hashicorp/helm"
      version = "~> 2.11"
    }
  }
}

provider "kubernetes" {
  host  = var.cluster_endpoint
  token = var.cluster_token
  cluster_ca_certificate = base64decode(
    var.cluster_ca_certificate
  )
}

# Configure Helm to talk to the same Kubernetes cluster
provider "helm" {
  kubernetes {
    host  = var.cluster_endpoint
    token = var.cluster_token
    cluster_ca_certificate = base64decode(
      var.cluster_ca_certificate
    )
  }
}

 

resource "kubernetes_namespace" "production" {
  metadata {
    name = var.namespace
  }
}

resource "kubernetes_secret" "example" {
  metadata {
    name = "docker-cfg"
    namespace = var.namespace
  }

  data = {
    ".dockerconfigjson" = var.docker_credentials
  }

  type = "kubernetes.io/dockerconfigjson"
}

# -----------------------------------------------------------------------------
# Metrics Server (Helm)
# -----------------------------------------------------------------------------
resource "helm_release" "metrics_server" {
  name       = "metrics-server"
  repository = "https://kubernetes-sigs.github.io/metrics-server/"
  chart      = "metrics-server"
  namespace  = "metrics-server"
  create_namespace = true
}

# -----------------------------------------------------------------------------
# NGINX Ingress Controller (Helm)
# -----------------------------------------------------------------------------
resource "helm_release" "ingress_nginx" {
  name       = "ingress-nginx"
  repository = "https://kubernetes.github.io/ingress-nginx"
  chart      = "ingress-nginx"
  namespace  = "ingress-nginx"
  create_namespace = true
}
