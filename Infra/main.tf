

module "registry" {
  source        = "./modules/registry"
  registry_name = "student-app-registry"
}

module "doks" {
  source = "./modules/doks"
  cluster_name = "student-app-cluster"
  region = "sgp1"
  node_pool_name = "student-app-node-pool"
  node_pool_size = "s-2vcpu-4gb"
  node_count = 3
}

resource "digitalocean_container_registry_docker_credentials" "this" {
  registry_name = module.registry.registry_name
  depends_on = [module.registry]
}

module "kubernetes" {
  source = "./modules/kubernetes"
  cluster_endpoint = module.doks.cluster_endpoint
  cluster_token = module.doks.cluster_token
  cluster_ca_certificate = module.doks.cluster_ca_certificate
  namespace = "production"
  docker_credentials = digitalocean_container_registry_docker_credentials.this.docker_credentials
}
