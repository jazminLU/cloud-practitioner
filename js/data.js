const CATEGORIES = {
  compute:    { label: 'Compute',    color: '#60A5FA', bg: '#1e3a5f' },
  storage:    { label: 'Storage',    color: '#A78BFA', bg: '#2d1f5e' },
  database:   { label: 'Database',   color: '#34D399', bg: '#0d3a2a' },
  network:    { label: 'Networking', color: '#FBBF24', bg: '#3d2e0a' },
  security:   { label: 'Security',   color: '#F87171', bg: '#3d1515' },
  management: { label: 'Management', color: '#F472B6', bg: '#3d1535' },
  billing:    { label: 'Billing',    color: '#86EFAC', bg: '#0d3020' },
  ml:         { label: 'AI / ML',    color: '#FCD34D', bg: '#3d3010' },
  migration:  { label: 'Migración',  color: '#FB923C', bg: '#3d2010' },
};

const SERVICES = [
  // ── Compute ──────────────────────────────────────────────────────────────
  {
    cat: 'compute', name: 'EC2', short: 'Elastic Compute Cloud',
    desc: 'Servidores virtuales en la nube. Elegís el tipo de instancia, SO, CPU y memoria. La base del cómputo en AWS.',
    tips: ['Tipos de instancia: General (T, M), Compute (C), Memory (R, X), Storage (I, D)', 'Modelos de pago: On-Demand, Reserved, Spot, Dedicated'],
  },
  {
    cat: 'compute', name: 'Lambda', short: 'Funciones serverless',
    desc: 'Ejecuta código sin gestionar servidores. Solo pagás por el tiempo de ejecución (en milisegundos). Ideal para tareas eventuales y event-driven.',
    tips: ['Límite de 15 minutos por ejecución', 'Se integra nativamente con S3, DynamoDB, API Gateway, SQS'],
  },
  {
    cat: 'compute', name: 'Elastic Beanstalk', short: 'PaaS para apps',
    desc: 'Subís tu código y AWS gestiona automáticamente el deploy, escalado, balanceo de carga y salud de la aplicación. Abstrae la infra subyacente.',
    tips: ['No hay costo por Beanstalk en sí, solo por los recursos que usa', 'Soporta Node.js, Python, Java, .NET, PHP, Ruby, Go, Docker'],
  },
  {
    cat: 'compute', name: 'ECS', short: 'Elastic Container Service',
    desc: 'Servicio administrado para correr contenedores Docker. Podés usar el scheduler propio de AWS en lugar de Kubernetes.',
    tips: ['Integra con Fargate (serverless) o EC2 (vos gestionás los nodos)', 'Alternativa a EKS si no necesitás Kubernetes'],
  },
  {
    cat: 'compute', name: 'EKS', short: 'Elastic Kubernetes Service',
    desc: 'Kubernetes administrado por AWS. AWS maneja el control plane; vos gestionás los node groups. Opción para equipos que ya usan K8s.',
    tips: ['Compatible con herramientas estándar de K8s (kubectl, Helm)', 'Soporta nodos EC2 On-Demand y Spot, además de Fargate'],
  },
  {
    cat: 'compute', name: 'Fargate', short: 'Cómputo serverless para contenedores',
    desc: 'Corre contenedores (en ECS o EKS) sin gestionar los servidores subyacentes. AWS provisiona y escala la capacidad automáticamente.',
    tips: ['Pagás por vCPU y memoria reservados, no por instancias', 'Elimina la necesidad de gestionar grupos de nodos EC2'],
  },
  {
    cat: 'compute', name: 'Auto Scaling', short: 'Escalado automático',
    desc: 'Ajusta automáticamente la cantidad de instancias EC2 según la demanda. Escala hacia arriba en picos y hacia abajo en quietud para optimizar costos.',
    tips: ['Políticas: Target Tracking, Step Scaling, Scheduled', 'También aplica a DynamoDB, Aurora, ECS tasks y más'],
  },
  {
    cat: 'compute', name: 'ELB', short: 'Elastic Load Balancer',
    desc: 'Distribuye el tráfico entrante entre múltiples instancias o targets. Tipos: ALB (capa 7 / HTTP·HTTPS), NLB (capa 4 / TCP), CLB (legado).',
    tips: ['ALB = HTTP/HTTPS; enruta por path o host header', 'NLB = TCP/UDP; ultra baja latencia y millones de req/s'],
  },

  // ── Storage ───────────────────────────────────────────────────────────────
  {
    cat: 'storage', name: 'S3', short: 'Simple Storage Service',
    desc: 'Almacenamiento de objetos ilimitado organizado en buckets. Durabilidad del 99.999999999% (11 nueves). Clases de almacenamiento según frecuencia de acceso.',
    tips: ['Clases: Standard, Intelligent-Tiering, Standard-IA, One Zone-IA, Glacier', 'No es un sistema de archivos; los objetos se acceden por URL/API'],
  },
  {
    cat: 'storage', name: 'S3 Glacier', short: 'Archivado de largo plazo',
    desc: 'Clase de S3 para datos que casi nunca se acceden. Costo muy bajo pero recuperación lenta: minutos (Instant), horas (Flexible) o días (Deep Archive).',
    tips: ['Glacier Instant Retrieval: acceso en milisegundos con costo menor a Standard-IA', 'Deep Archive: el más barato, recuperación en 12 h'],
  },
  {
    cat: 'storage', name: 'EBS', short: 'Elastic Block Store',
    desc: 'Discos virtuales de bloque que se adjuntan a instancias EC2. Como un disco rígido externo: persiste cuando la instancia se detiene o reinicia.',
    tips: ['Tipos: gp3/gp2 (SSD general), io2/io1 (SSD alta performance), st1/sc1 (HDD)', 'Un volumen EBS solo puede adjuntarse a una instancia a la vez (salvo Multi-Attach io2)'],
  },
  {
    cat: 'storage', name: 'EFS', short: 'Elastic File System',
    desc: 'Sistema de archivos NFS administrado accesible desde múltiples instancias EC2 al mismo tiempo. Se escala automáticamente según el uso.',
    tips: ['A diferencia de EBS, EFS puede montarse en muchas instancias simultáneamente', 'Más caro que EBS; ideal para datos compartidos entre servidores'],
  },
  {
    cat: 'storage', name: 'Storage Gateway', short: 'Puente on-prem → nube',
    desc: 'Conecta infraestructura local (on-premises) con almacenamiento en AWS. Ideal para migraciones híbridas o backups incrementales hacia S3.',
    tips: ['Tipos: File Gateway (NFS/SMB a S3), Volume Gateway (iSCSI), Tape Gateway (VTL)'],
  },
  {
    cat: 'storage', name: 'ECR', short: 'Elastic Container Registry',
    desc: 'Registro privado de imágenes Docker completamente administrado, integrado con IAM para control de acceso. Elimina la necesidad de DockerHub privado.',
    tips: ['Integración nativa con ECS y EKS', 'Soporte para image scanning de vulnerabilidades y lifecycle policies'],
  },

  // ── Database ──────────────────────────────────────────────────────────────
  {
    cat: 'database', name: 'RDS', short: 'Relational Database Service',
    desc: 'Bases de datos relacionales administradas: PostgreSQL, MySQL, MariaDB, Oracle, SQL Server. AWS gestiona backups, parches y alta disponibilidad (Multi-AZ).',
    tips: ['Multi-AZ = alta disponibilidad (failover automático); Read Replicas = escalado de lectura', 'No tenés acceso SSH al servidor de base de datos'],
  },
  {
    cat: 'database', name: 'Aurora', short: 'DB relacional de alto rendimiento',
    desc: 'Motor de base de datos propio de AWS, compatible con MySQL y PostgreSQL pero hasta 5× más rápido. Réplicas automáticas en múltiples AZ con failover en 30 s.',
    tips: ['Aurora Serverless v2 escala automáticamente según la carga', 'Aurora Global Database replica a otras regiones con latencia < 1 s'],
  },
  {
    cat: 'database', name: 'DynamoDB', short: 'NoSQL serverless',
    desc: 'Base de datos NoSQL clave-valor y de documentos. Totalmente administrada, escala automáticamente y ofrece latencia de un dígito de milisegundos a cualquier escala.',
    tips: ['Sin esquema fijo; cada ítem puede tener atributos distintos', 'DAX (DynamoDB Accelerator) agrega caché en memoria para latencia de microsegundos'],
  },
  {
    cat: 'database', name: 'ElastiCache', short: 'Caché en memoria',
    desc: 'Redis o Memcached administrados. Acelera aplicaciones cacheando datos frecuentemente consultados en RAM, reduciendo la carga en la base de datos principal.',
    tips: ['Redis: estructuras de datos avanzadas, persistencia, pub/sub', 'Memcached: más simple, multi-thread, ideal para cachés de objetos puros'],
  },
  {
    cat: 'database', name: 'Redshift', short: 'Data warehouse columnar',
    desc: 'Data warehouse analítico a gran escala. No es para apps transaccionales; está optimizado para consultas analíticas sobre petabytes de datos históricos.',
    tips: ['Almacenamiento columnar: ideal para agregaciones y reportes', 'Redshift Serverless elimina la gestión de clusters'],
  },

  // ── Networking ────────────────────────────────────────────────────────────
  {
    cat: 'network', name: 'VPC', short: 'Virtual Private Cloud',
    desc: 'Red privada aislada dentro de AWS. Definís subnets públicas y privadas, tablas de ruteo, internet gateways y NAT gateways. La base de cualquier arquitectura en AWS.',
    tips: ['Subnet pública = tiene ruta al Internet Gateway; privada = solo al NAT Gateway', 'Security Groups (stateful) y NACLs (stateless) controlan el tráfico'],
  },
  {
    cat: 'network', name: 'Route 53', short: 'DNS administrado',
    desc: 'Servicio de DNS de AWS. Traduce nombres de dominio a IPs. También hace health checks y routing inteligente: por latencia, geolocalización, failover, peso.',
    tips: ['Registrar dominios directamente en Route 53', 'Routing policies: Simple, Weighted, Latency, Failover, Geolocation, Multivalue'],
  },
  {
    cat: 'network', name: 'CloudFront', short: 'CDN global',
    desc: 'Red de distribución de contenido con más de 450 edge locations. Cachea contenido cerca del usuario para reducir latencia. Integrado con S3, ALB y Lambda@Edge.',
    tips: ['Reduce latencia y costo de transferencia de datos desde S3', 'Puede ejecutar lógica en el borde con Lambda@Edge o CloudFront Functions'],
  },
  {
    cat: 'network', name: 'API Gateway', short: 'Gestión de APIs',
    desc: 'Crea, publica, mantiene y protege APIs REST, HTTP y WebSocket a cualquier escala. Generalmente se usa como frontend de funciones Lambda o servicios backend.',
    tips: ['Maneja throttling, autenticación, caché de respuestas y versionado', 'Integra con Cognito o Lambda Authorizers para auth personalizada'],
  },
  {
    cat: 'network', name: 'Direct Connect', short: 'Enlace dedicado on-prem',
    desc: 'Enlace de red físico y dedicado entre tu data center y AWS. Más estable, rápido y predecible que una VPN pública. No pasa por internet.',
    tips: ['Velocidades desde 50 Mbps hasta 100 Gbps', 'Mayor costo inicial pero menor costo por GB transferido que internet pública'],
  },
  {
    cat: 'network', name: 'NAT Gateway', short: 'Salida a internet para subnets privadas',
    desc: 'Permite que recursos en subnets privadas (EC2, RDS, pods de EKS) accedan a internet para actualizaciones, sin exponer una IP pública.',
    tips: ['NAT Gateway es administrado por AWS; NAT Instance requiere que vos lo gestiones', 'Se cobra por hora activa + GB de datos procesados'],
  },

  // ── Security ──────────────────────────────────────────────────────────────
  {
    cat: 'security', name: 'IAM', short: 'Identity & Access Management',
    desc: 'Control de acceso central de AWS. Gestiona usuarios, grupos, roles y políticas de permisos con principio de mínimo privilegio.',
    tips: ['Política = JSON que define Allow/Deny sobre Actions y Resources', 'Los roles permiten que servicios de AWS asuman permisos sin usar credenciales de usuario'],
  },
  {
    cat: 'security', name: 'ACM', short: 'AWS Certificate Manager',
    desc: 'Provisiona y renueva automáticamente certificados TLS/SSL para dominios y subdominios. Integrado con ALB, CloudFront y API Gateway.',
    tips: ['Certificados públicos son gratuitos', 'Validación por DNS (recomendada) o por email'],
  },
  {
    cat: 'security', name: 'Secrets Manager', short: 'Gestión de secretos',
    desc: 'Almacena y rota automáticamente secretos como contraseñas de base de datos, API keys y tokens. Elimina credenciales hardcodeadas en el código.',
    tips: ['Rotación automática integrada con RDS, Redshift, DocumentDB', 'Cobra por secreto por mes + llamadas a la API'],
  },
  {
    cat: 'security', name: 'KMS', short: 'Key Management Service',
    desc: 'Crea, gestiona y controla claves de cifrado. Se integra con casi todos los servicios de AWS (S3, RDS, EBS, Lambda) para cifrado en reposo.',
    tips: ['CMK (Customer Managed Key) = vos controlás políticas y rotación', 'AWS Managed Key = AWS gestiona la clave por vos (menos control)'],
  },
  {
    cat: 'security', name: 'GuardDuty', short: 'Detección de amenazas con ML',
    desc: 'Monitorea continuamente CloudTrail, VPC Flow Logs y DNS para detectar comportamientos sospechosos: reconocimiento, compromiso de instancias, exfiltración de datos.',
    tips: ['Se activa con un click, no requiere agentes ni configuración compleja', 'Genera findings categorizados por severidad que podés automatizar con EventBridge'],
  },
  {
    cat: 'security', name: 'Inspector', short: 'Escaneo de vulnerabilidades',
    desc: 'Escanea instancias EC2 e imágenes en ECR buscando CVEs y configuraciones de red inseguras. Genera un risk score para priorizar remediaciones.',
    tips: ['Inspector v2 es continuo y automático (no en intervalos)', 'Integra con Security Hub para vista centralizada'],
  },
  {
    cat: 'security', name: 'Shield', short: 'Protección DDoS',
    desc: 'Shield Standard (gratis) protege automáticamente contra ataques DDoS comunes. Shield Advanced (pago) agrega protección sofisticada, soporte 24/7 y reembolsos de costo.',
    tips: ['Standard: activado por defecto en todas las cuentas', 'Advanced: protege ELB, CloudFront, Route 53, EC2, Global Accelerator'],
  },
  {
    cat: 'security', name: 'WAF', short: 'Web Application Firewall',
    desc: 'Filtra el tráfico HTTP malicioso hacia tus aplicaciones. Podés crear reglas para bloquear SQL injection, XSS, IPs específicas o usar Managed Rule Groups de AWS.',
    tips: ['Se adjunta a CloudFront, ALB, API Gateway o AppSync', 'Managed Rules de AWS cubren OWASP Top 10 listo para usar'],
  },
  {
    cat: 'security', name: 'Macie', short: 'Detección de datos sensibles en S3',
    desc: 'Usa ML para descubrir y clasificar datos sensibles (PII, información financiera, credenciales) almacenados en buckets de S3 y alertar sobre exposiciones.',
    tips: ['Genera findings con la ubicación exacta de los datos sensibles', 'Útil para compliance con GDPR, HIPAA, PCI-DSS'],
  },
  {
    cat: 'security', name: 'Artifact', short: 'Reportes de compliance',
    desc: 'Portal donde AWS publica sus reportes de auditoría y certificaciones de compliance: SOC 1/2/3, PCI DSS, ISO 27001, HIPAA, etc.',
    tips: ['Gratis; solo requiere aceptar un NDA de AWS', 'Lo usan equipos de auditoría y compliance para demostrar que AWS cumple estándares'],
  },
  {
    cat: 'security', name: 'Cognito', short: 'Autenticación de usuarios finales',
    desc: 'Gestiona registro, login, OAuth 2.0 / OIDC y MFA para las aplicaciones. Evita implementar autenticación desde cero.',
    tips: ['User Pools = directorio de usuarios (login/signup)', 'Identity Pools = credenciales AWS temporales para acceder a otros servicios directamente'],
  },

  // ── Management ────────────────────────────────────────────────────────────
  {
    cat: 'management', name: 'CloudWatch', short: 'Monitoreo y logs',
    desc: 'Recopila métricas, logs y eventos de todos los servicios de AWS. Podés crear dashboards, alarmas por email/SNS y ver logs de tus aplicaciones en tiempo real.',
    tips: ['Alarmas pueden disparar acciones: escalar EC2, enviar notificación SNS, etc.', 'CloudWatch Logs Insights permite queries tipo SQL sobre logs'],
  },
  {
    cat: 'management', name: 'CloudTrail', short: 'Auditoría de API calls',
    desc: 'Registra cada llamada a la API de AWS: quién la hizo, desde dónde, cuándo y cuál fue la respuesta. Fundamental para seguridad, compliance y forensics.',
    tips: ['Habilitado por defecto en todas las cuentas (últimos 90 días)', 'Para retención larga, enviá logs a S3'],
  },
  {
    cat: 'management', name: 'Config', short: 'Historial de configuración de recursos',
    desc: 'Registra los cambios de configuración de recursos AWS en el tiempo. Podés ver el estado de cualquier recurso en cualquier momento del pasado y crear reglas de compliance.',
    tips: ['Config Rules evalúan si los recursos cumplen con políticas definidas', 'Se integra con Systems Manager para remediación automática'],
  },
  {
    cat: 'management', name: 'Systems Manager', short: 'Gestión operativa centralizada',
    desc: 'Suite de herramientas para gestionar instancias EC2: parches, sesiones SSH sin abrir puertos (Session Manager), automatización y almacenamiento de configuraciones (Parameter Store).',
    tips: ['Parameter Store: alternativa gratuita o de bajo costo a Secrets Manager para configuraciones no sensibles', 'Patch Manager aplica parches automáticamente según ventanas de mantenimiento'],
  },
  {
    cat: 'management', name: 'Trusted Advisor', short: 'Recomendaciones automáticas',
    desc: 'Analiza tu cuenta y proporciona recomendaciones en 5 áreas: costo, performance, seguridad, tolerancia a fallos y límites de servicio.',
    tips: ['Checks básicos gratis para todos; checks completos requieren plan Business o Enterprise', 'Identifica recursos sin usar, security groups abiertos, MFA desactivado, etc.'],
  },
  {
    cat: 'management', name: 'CloudFormation', short: 'Infraestructura como código (nativo AWS)',
    desc: 'Define recursos de AWS en templates YAML o JSON y AWS los provisiona automáticamente. Es el equivalente nativo de Terraform pero solo para AWS.',
    tips: ['Stack = conjunto de recursos definidos en un template', 'Change Sets muestran qué va a cambiar antes de aplicar una actualización'],
  },
  {
    cat: 'management', name: 'Service Catalog', short: 'Catálogo de productos aprobados',
    desc: 'Permite a equipos de IT publicar portfolios de recursos de AWS pre-aprobados que los usuarios pueden desplegar en self-service, dentro de los estándares de la empresa.',
    tips: ['Garantiza que nadie despliegue recursos fuera de las políticas corporativas', 'Los productos son templates de CloudFormation encapsulados'],
  },

  // ── Billing ───────────────────────────────────────────────────────────────
  {
    cat: 'billing', name: 'Cost Explorer', short: 'Análisis visual de costos',
    desc: 'Visualizá y analizá tus gastos en AWS a lo largo del tiempo. Filtrá por servicio, región, tag, cuenta y ves forecasts de gasto futuro basados en el patrón histórico.',
    tips: ['Permite ver el desglose por servicio, región o etiqueta', 'Los forecasts tienen hasta 12 meses de proyección'],
  },
  {
    cat: 'billing', name: 'AWS Budgets', short: 'Alertas de gasto',
    desc: 'Configura alertas cuando el gasto real o proyectado supera un umbral definido. Podés alertar por costo total, uso de servicio o cobertura de reservas.',
    tips: ['Notificaciones por email o SNS', 'Podés crear acciones automáticas (ej: detener instancias) al superar el budget'],
  },
  {
    cat: 'billing', name: 'Pricing Calculator', short: 'Estimador de costos previo',
    desc: 'Herramienta web de AWS para estimar cuánto va a costar una arquitectura antes de implementarla. Útil para presupuestar proyectos o migraciones.',
    tips: ['Gratis de usar; no requiere cuenta de AWS', 'Podés guardar y compartir estimaciones con link'],
  },
  {
    cat: 'billing', name: 'Organizations', short: 'Gestión multi-cuenta',
    desc: 'Agrupa múltiples cuentas de AWS bajo una organización. Permite facturación consolidada, control centralizado con Service Control Policies (SCP) y descuentos por volumen.',
    tips: ['SCP restringe lo que las cuentas miembro pueden hacer, incluso si su IAM lo permite', 'La cuenta master paga todo y recibe descuentos de volumen aggregados'],
  },
  {
    cat: 'billing', name: 'Reserved Instances', short: 'Descuento 1-3 años (hasta 72%)',
    desc: 'Compromiso de uso de 1 o 3 años a cambio de descuentos de hasta un 72% respecto a On-Demand. Ideal para cargas de trabajo estables y predecibles.',
    tips: ['Standard RI: mayor descuento, no se puede cambiar el tipo de instancia', 'Convertible RI: algo menos de descuento, pero podés cambiar el tipo de instancia'],
  },
  {
    cat: 'billing', name: 'Savings Plans', short: 'Descuento flexible por compromiso de gasto',
    desc: 'Te comprometés con un gasto por hora (ej: $10/h) durante 1 o 3 años y el descuento aplica automáticamente a cualquier servicio elegible, en cualquier región.',
    tips: ['Compute Savings Plans: aplica a EC2, Lambda y Fargate en cualquier región/OS', 'EC2 Savings Plans: solo EC2 pero mayor descuento'],
  },
  {
    cat: 'billing', name: 'Spot Instances', short: 'Capacidad no utilizada con hasta 90% de descuento',
    desc: 'Instancias EC2 a precio muy bajo usando capacidad inactiva de AWS, pero pueden ser recuperadas con 2 minutos de aviso. Perfectas para cargas tolerantes a interrupciones.',
    tips: ['Spot Fleet gestiona un conjunto de tipos de instancias para maximizar disponibilidad', 'Ideal para: batch jobs, rendering, simulaciones, CI/CD workers, ML training'],
  },

  // ── AI / ML ───────────────────────────────────────────────────────────────
  {
    cat: 'ml', name: 'SageMaker', short: 'Plataforma de ML end-to-end',
    desc: 'Cubre todo el ciclo de vida de ML: preparación de datos, entrenamiento de modelos, ajuste de hiperparámetros y despliegue en producción.',
    tips: ['SageMaker Studio: IDE web para ML', 'Para el Practitioner solo necesitás saber para qué sirve, no los detalles técnicos'],
  },
  {
    cat: 'ml', name: 'Rekognition', short: 'Análisis de imágenes y video con IA',
    desc: 'Detecta objetos, escenas, caras, texto y contenido inapropiado en imágenes y videos. API lista para consumir sin conocimientos de ML.',
    tips: ['Casos de uso: moderación de contenido, verificación de identidad, búsqueda de celebridades', 'Rekognition Video analiza streams en tiempo real o videos almacenados en S3'],
  },
  {
    cat: 'ml', name: 'Comprehend', short: 'Procesamiento de lenguaje natural',
    desc: 'Extrae entidades, sentimientos (positivo/negativo/neutral), idioma y frases clave de texto sin estructurar. Útil para analizar reviews, tickets o documentos.',
    tips: ['Comprehend Medical: extrae entidades médicas (diagnósticos, medicamentos)', 'Sin conocimientos de ML necesarios; solo llamadas a la API'],
  },
  {
    cat: 'ml', name: 'Textract', short: 'Extracción de texto de documentos',
    desc: 'OCR avanzado que lee texto, tablas y formularios de imágenes y PDFs, incluso cuando están escaneados. Va más allá del OCR tradicional al entender la estructura.',
    tips: ['Detecta automáticamente campos de formularios y celdas de tablas', 'Ideal para digitalizar documentos legacy: facturas, contratos, formularios médicos'],
  },
  {
    cat: 'ml', name: 'Polly', short: 'Texto a voz (TTS)',
    desc: 'Convierte texto en audio realista en más de 60 voces y 30 idiomas. Sirve para accesibilidad, chatbots de voz y generación de contenido de audio.',
    tips: ['Voces neurales (Neural TTS) suenan más naturales que las voces estándar', 'Podés personalizar pronunciación con SSML'],
  },
  {
    cat: 'ml', name: 'Transcribe', short: 'Voz a texto (STT)',
    desc: 'Transcribe automáticamente audio y video a texto. Soporta múltiples idiomas, identificación de hablantes (diarización) y vocabulario personalizado.',
    tips: ['Transcribe Medical: vocabulario médico especializado', 'Útil para subtitulado automático, análisis de llamadas de call center'],
  },
  {
    cat: 'ml', name: 'Bedrock', short: 'Foundation models como servicio',
    desc: 'Accedé a grandes modelos de lenguaje (LLMs) de distintos proveedores vía API: Anthropic Claude, Meta Llama, Mistral, Amazon Titan y más. Sin gestionar infraestructura de ML.',
    tips: ['Serverless: solo pagás por tokens generados', 'Incluye Guardrails para filtrar contenido y Agents para automatizar flujos multi-paso'],
  },

  // ── Migración ─────────────────────────────────────────────────────────────
  {
    cat: 'migration', name: 'AWS Migration Hub', short: 'Panel central de migraciones',
    desc: 'Panel centralizado para hacer seguimiento del progreso de migraciones desde on-premises hacia AWS, independientemente de qué herramienta de migración estés usando.',
    tips: ['Se integra con Application Discovery Service, DMS, Server Migration Service', 'Muestra el estado de cada servidor o aplicación en el proceso de migración'],
  },
  {
    cat: 'migration', name: 'DMS', short: 'Database Migration Service',
    desc: 'Migra bases de datos hacia AWS con mínimo downtime. Soporta migraciones homogéneas (ej: Oracle → RDS Oracle) y heterogéneas (ej: Oracle → Aurora PostgreSQL).',
    tips: ['Para heterogéneo: primero convertí el esquema con AWS Schema Conversion Tool (SCT)', 'Puede hacer replicación continua (CDC) mientras la DB origen sigue activa'],
  },
  {
    cat: 'migration', name: 'Snow Family', short: 'Migración física de datos a gran escala',
    desc: 'Dispositivos físicos enviados a tu data center para migrar petabytes de datos cuando la conectividad de red es muy lenta, costosa o inestable.',
    tips: ['Snowcone: 8 TB, portátil; Snowball Edge: 80 TB, con cómputo local; Snowmobile: camión, hasta 100 PB', 'Regla: si mover los datos por internet tomaría más de una semana, usá Snow Family'],
  },
  {
    cat: 'migration', name: 'DataSync', short: 'Transferencia automatizada de datos',
    desc: 'Transfiere datos entre almacenamiento on-premises y AWS (S3, EFS, FSx) de forma automatizada y programada, con validación de integridad y compresión.',
    tips: ['Hasta 10× más rápido que herramientas open source como rsync', 'Ideal para migraciones NFS/SMB → S3/EFS y sincronización de datos ongoing'],
  },
];
