variable "cluster_endpoint" {
  type = string
  description = "The endpoint of the cluster"
}

variable "cluster_token" {
  type = string
  description = "The token of the cluster"
}

variable "cluster_ca_certificate" {
  type = string
  description = "The ca certificate of the cluster"
}       

variable "namespace" {
  type = string
  description = "The namespace of the cluster"
}

variable "docker_credentials" {
  type = string
  description = "The docker credentials of the cluster"
}
