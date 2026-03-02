# Despliegue en EKS - Roadmap App

## Prerrequisitos

- AWS CLI configurado
- kubectl instalado
- eksctl instalado
- Docker instalado

## Paso 1: Crear Cluster EKS

```bash
# Crear cluster EKS (ajusta región y nombre según necesites)
eksctl create cluster \
  --name roadmap-cluster \
  --region us-east-1 \
  --nodegroup-name standard-workers \
  --node-type t3.medium \
  --nodes 2 \
  --nodes-min 1 \
  --nodes-max 3 \
  --managed

# Verificar conexión
kubectl get nodes
```

## Paso 2: Crear ECR Repository

```bash
# Crear repositorio en ECR
aws ecr create-repository \
  --repository-name roadmap-app \
  --region us-east-1

# Obtener URI del repositorio (guarda este valor)
aws ecr describe-repositories \
  --repository-names roadmap-app \
  --region us-east-1 \
  --query 'repositories[0].repositoryUri' \
  --output text
```

## Paso 3: Build y Push de la Imagen

```bash
# Login a ECR
aws ecr get-login-password --region us-east-1 | \
  docker login --username AWS --password-stdin <ACCOUNT_ID>.dkr.ecr.us-east-1.amazonaws.com

# Build de la imagen
docker build -t roadmap-app .

# Tag de la imagen
docker tag roadmap-app:latest <ECR_URI>:latest

# Push a ECR
docker push <ECR_URI>:latest
```

## Paso 4: Instalar AWS Load Balancer Controller

```bash
# Crear IAM OIDC provider
eksctl utils associate-iam-oidc-provider \
  --region us-east-1 \
  --cluster roadmap-cluster \
  --approve

# Descargar IAM policy
curl -o iam_policy.json https://raw.githubusercontent.com/kubernetes-sigs/aws-load-balancer-controller/v2.7.0/docs/install/iam_policy.json

# Crear IAM policy
aws iam create-policy \
  --policy-name AWSLoadBalancerControllerIAMPolicy \
  --policy-document file://iam_policy.json

# Crear service account
eksctl create iamserviceaccount \
  --cluster=roadmap-cluster \
  --namespace=kube-system \
  --name=aws-load-balancer-controller \
  --attach-policy-arn=arn:aws:iam::<ACCOUNT_ID>:policy/AWSLoadBalancerControllerIAMPolicy \
  --override-existing-serviceaccounts \
  --region us-east-1 \
  --approve

# Instalar controller con Helm
helm repo add eks https://aws.github.io/eks-charts
helm repo update

helm install aws-load-balancer-controller eks/aws-load-balancer-controller \
  -n kube-system \
  --set clusterName=roadmap-cluster \
  --set serviceAccount.create=false \
  --set serviceAccount.name=aws-load-balancer-controller

# Verificar instalación
kubectl get deployment -n kube-system aws-load-balancer-controller
```

## Paso 5: Desplegar la Aplicación

```bash
# Actualizar k8s/deployment.yaml con tu ECR URI
# Reemplaza <YOUR_ECR_REPO> con tu URI de ECR

# Aplicar manifiestos
kubectl apply -f k8s/deployment.yaml

# Verificar despliegue
kubectl get pods
kubectl get svc
kubectl get ingress
```

## Paso 6: Obtener URL Pública

```bash
# Esperar a que el ALB se aprovisione (puede tomar 2-3 minutos)
kubectl get ingress roadmap-app-ingress -w

# Obtener la URL del ALB
kubectl get ingress roadmap-app-ingress -o jsonpath='{.status.loadBalancer.ingress[0].hostname}'
```

## Verificación

```bash
# Verificar pods
kubectl get pods -l app=roadmap-app

# Ver logs
kubectl logs -l app=roadmap-app --tail=50

# Describir ingress
kubectl describe ingress roadmap-app-ingress
```

## Limpieza (Opcional)

```bash
# Eliminar recursos de Kubernetes
kubectl delete -f k8s/deployment.yaml

# Eliminar cluster
eksctl delete cluster --name roadmap-cluster --region us-east-1

# Eliminar repositorio ECR
aws ecr delete-repository \
  --repository-name roadmap-app \
  --region us-east-1 \
  --force
```

## Notas Importantes

1. **Costos**: El cluster EKS tiene un costo de ~$0.10/hora + costos de EC2 nodes
2. **Seguridad**: Para producción, considera:
   - Agregar HTTPS con ACM (AWS Certificate Manager)
   - Configurar WAF en el ALB
   - Implementar Network Policies
   - Usar secrets para configuraciones sensibles
3. **Escalabilidad**: Ajusta replicas y recursos según tu carga
4. **Monitoreo**: Considera instalar Prometheus/Grafana para observabilidad

## HTTPS (Opcional pero Recomendado)

Para habilitar HTTPS, agrega estas anotaciones al Ingress:

```yaml
annotations:
  alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:region:account:certificate/xxx
  alb.ingress.kubernetes.io/listen-ports: '[{"HTTP": 80}, {"HTTPS": 443}]'
  alb.ingress.kubernetes.io/ssl-redirect: '443'
```
