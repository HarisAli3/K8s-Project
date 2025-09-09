variable "cluster_name" {
  type = string
  description = "The name of the cluster"
}

variable "region" {
  type = string
  description = "The region of the cluster"
}

variable "k8s_version" {
  type        = string
  description = "The Kubernetes version slug (e.g. 1.30.2-do.0)"
  default     = null
}

variable "node_pool_name" {
  type = string
  description = "The name of the node pool"
}

variable "node_pool_size" {
  type = string
  description = "The size of the node pool"
}

variable "node_count" {
  type = number
  description = "The number of nodes in the node pool"
}