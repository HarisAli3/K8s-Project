terraform {
  required_providers {
    digitalocean = {
      source  = "digitalocean/digitalocean"
      version = ">= 2.4.0"
    }
  }
}

# Create a new container registry
resource "digitalocean_container_registry" "student_app_registry" {
  name                   = var.registry_name
  subscription_tier_slug = "basic"
}