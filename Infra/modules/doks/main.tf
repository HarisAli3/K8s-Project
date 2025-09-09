terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = ">= 2.4.0"
    }
  }
}

resource "digitalocean_kubernetes_cluster" "foo" {
  name    = var.cluster_name
  region  = var.region
  version = coalesce(var.k8s_version, data.digitalocean_kubernetes_versions.this.latest_version)

  node_pool {
    name       = var.node_pool_name
    size       = var.node_pool_size
    node_count = var.node_count
  }
}

data "digitalocean_kubernetes_versions" "this" {}