# AWS Cloud Practitioner — Practice App

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![AWS](https://img.shields.io/badge/AWS-FF9900?style=for-the-badge&logo=amazonaws&logoColor=white)
![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-222222?style=for-the-badge&logo=githubpages&logoColor=white)

**🚀 [Ver app en vivo](https://jazminlu.github.io/cloud-practitioner/)**

App de práctica para el examen **AWS Certified Cloud Practitioner (CLF-C02)**. Sin dependencias externas ni servidor — abrís el archivo y empezás a estudiar.

---

## Características

- **60+ servicios AWS** organizados en 9 categorías del examen
- **Modo Flashcards** — repasá a tu ritmo con animación de volteo
- **Modo Quiz** — opción múltiple con 3 tipos de pregunta
- **Progreso persistente** — guardado en `localStorage`, sobrevive al cierre del navegador
- **Áreas débiles** — detecta automáticamente qué servicios seguís errando y te permite practicarlos por separado
- **Atajos de teclado** — navegación sin mouse
- **Responsive** — funciona en mobile y desktop

---

## Cómo usar

### 1. Clonar el repositorio

```bash
git clone https://github.com/jazminLU/cloud-practitioner.git
cd cloud-practitioner
```

### 2. Abrir en el navegador

Abrí `index.html` con doble click o arrastrálo a tu navegador. No necesita servidor.

```
cloud-practitioner/
├── index.html       ← punto de entrada
├── css/
│   └── styles.css
└── js/
    ├── data.js      ← datos de los 60+ servicios AWS
    └── app.js       ← lógica de la aplicación
```

---

## Modos de práctica

### Flashcards

Repasá cada servicio a tu propio ritmo.

| Acción | Teclado |
|--------|---------|
| Voltear tarjeta | `Space` o click |
| Tarjeta anterior | `←` |
| Tarjeta siguiente | `→` |
| Lo sabía ✓ | `1` |
| Regular | `2` |
| No sabía ✗ | `3` |

Calificar cada tarjeta actualiza tu progreso y alimenta la detección de **áreas débiles**.

### Quiz

Opción múltiple con 4 alternativas. Tres modos disponibles:

- **Nombre → Descripción** — te muestra el nombre del servicio y elegís la descripción correcta
- **Descripción → Nombre** — te muestra la descripción y elegís el nombre correcto
- **Mixto** — combina los dos tipos aleatoriamente

| Acción | Teclado |
|--------|---------|
| Responder opción A/B/C/D | `A` `B` `C` `D` |
| Siguiente pregunta | `Enter` |

Al terminar el quiz ves el porcentaje por categoría y un botón para practicar solo los servicios que erraste.

### Dashboard

La pantalla de inicio muestra:

- Servicios dominados (respondidos correctamente al menos 2 veces sin errores)
- Servicios estudiados
- Porcentaje de progreso global
- Acceso rápido por categoría
- Banner de áreas débiles cuando las hay

---

## Categorías cubiertas

| Categoría | Servicios |
|-----------|-----------|
| Compute | EC2, Lambda, ECS, EKS, Fargate, Elastic Beanstalk, Auto Scaling, ELB |
| Storage | S3, S3 Glacier, EBS, EFS, Storage Gateway, ECR |
| Database | RDS, Aurora, DynamoDB, ElastiCache, Redshift |
| Networking | VPC, Route 53, CloudFront, API Gateway, Direct Connect, NAT Gateway |
| Security | IAM, ACM, Secrets Manager, KMS, GuardDuty, Inspector, Shield, WAF, Macie, Artifact, Cognito |
| Management | CloudWatch, CloudTrail, Config, Systems Manager, Trusted Advisor, CloudFormation, Service Catalog |
| Billing | Cost Explorer, AWS Budgets, Pricing Calculator, Organizations, Reserved Instances, Savings Plans, Spot Instances |
| AI / ML | SageMaker, Rekognition, Comprehend, Textract, Polly, Transcribe, Bedrock |
| Migración | Migration Hub, DMS, Snow Family, DataSync |

---

## Tecnologías

- **HTML5** semántico — sin frameworks
- **CSS3** — custom properties, grid, flexbox, animaciones
- **JavaScript ES6+** — vanilla, sin dependencias
- **localStorage** — persistencia de progreso en el navegador

---

## Examen CLF-C02

El examen AWS Cloud Practitioner cubre cuatro dominios:

| Dominio | Peso |
|---------|------|
| Cloud Concepts | 24% |
| Security and Compliance | 30% |
| Cloud Technology & Services | 34% |
| Billing, Pricing & Support | 12% |

> Esta app cubre principalmente el dominio de **Cloud Technology & Services** (servicios AWS), que representa el mayor peso del examen.

---

## Licencia

MIT
