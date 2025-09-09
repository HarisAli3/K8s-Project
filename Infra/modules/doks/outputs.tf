output "cluster_endpoint" {
  description = "API server endpoint"
  value       = digitalocean_kubernetes_cluster.foo.endpoint
}

output "cluster_token" {
  description = "Cluster admin token"
  value       = digitalocean_kubernetes_cluster.foo.kube_config.0.token
  sensitive   = true
}

output "cluster_ca_certificate" {
  description = "Cluster CA certificate (base64)"
  value       = digitalocean_kubernetes_cluster.foo.kube_config.0.cluster_ca_certificate
}

