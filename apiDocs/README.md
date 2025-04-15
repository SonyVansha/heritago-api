# 📘 API Documentation

## 🌐 Base URL

```
https://localhost:5000/api
```

---

## 📄 Endpoints

### Tour

#### `GET /api/tour`

Get list of all users. *(Requires auth)*

**Response:**

```json
{
  "id": 1,
  "nama": "Gunung Bromosasa",
  "lokasi": "Jawa Timur ssasassasasasasasas",
  "gambar": "https://ddjwanogodtvwhydsrqd.supabase.co/storage/v1/object/public/bucketwisata/wisata/20bssc81aa-bbd7-4101-bb17-e522f0b1c0ba.png",
  "deskripsi": "Gunung aktif terkenal di Jawa",
  "rating": null,
  "createdAt": "2025-04-15T03:41:21.000Z",
  "updatedAt": "2025-04-15T03:41:21.000Z"
}
```

---

#### `GET /api/tour/:id`

Get by ID.

**Response:**

```json
{
  "id": 1,
  "nama": "Gunung Bromosasa",
  "lokasi": "Jawa Timur ssasassasasasasasas",
  "gambar": "https://ddjwanogodtvwhydsrqd.supabase.co/storage/v1/object/public/bucketwisata/wisata/20asabc81aa-bbd7-4101-bb17-e522f0b1c0ba.png",
  "deskripsi": "Gunung aktif terkenal di Jawa",
  "rating": null,
  "createdAt": "2025-04-15T03:41:21.000Z",
  "updatedAt": "2025-04-15T03:41:21.000Z"
}
```

#### `POST /api/addtour`

Create a new tour using `multipart/form-data`.

**Request (Content-Type: multipart/form-data):**

| Field     | Type   | Description          |
|-----------|--------|----------------------|
| name      | text   | Name of the Tour     |
| lokasi    | text   | Location of the Tour |
| image     | file   | Tour Image           |
| deskripsi | text   | Tour deskripsi       |
| rating    | text   | Tour rating          |

**Response:**

```json
{
    "message": "Data berhasil disimpan",
    "data": {
        "id": 2,
        "nama": "Gunung Bromosasa",
        "lokasi": "Jawa Timur ssasassasasasasasas",
        "gambar": "https://ddjwanogodtvwhydsrqd.supabase.co/storage/v1/object/public/bucketwisata/wisata/45874de1-41bd-4f2e-a73e-2a2445ef2ddd.png",
        "deskripsi": "Gunung aktif terkenal di Jawa",
        "rating": "4.7",
        "updatedAt": "2025-04-15T03:55:09.264Z",
        "createdAt": "2025-04-15T03:55:09.264Z"
    }
}
```

#### `DELETE /api/addtour/:id`

**Response:**

```json
{
  "message": "Data dan gambar berhasil dihapus",
  "data": "2"
}
```

---

### Quiz

#### `GET /api/quizzes`

Get list of all Quiz.

**Response:**

```json
[
    {
        "id": 1,
        "nama": "Gunung Bromosasa"
    },
    {
        "id": 2,
        "nama": "Gunung Bromosasa"
    }
]
```

---

#### `GET /api/posts/:id/quiz`

Get by ID.

**Response:**

```json
{
    "quizId": 1,
    "questions": [
        {
            "questionId": 1,
            "text": "What is 2 + 2?",
            "options": {
                "A": "3",
                "B": "4",
                "C": "5"
            }
        }
    ]
}
```

#### `POST /api/posts/quiz/submit`

**Request (Content-Type: application/json):**

```json 
{
    "quizId": 1,
    "name": "Sony",
    "answers": {
        "1": "C"
    }
}
```

**Response:**

```json
{
    "certificateEligible": true,
    "score": 100,
    "totalQuestions": 1,
    "results": [
        {
            "questionId": 1,
            "questionText": "What is 2 + 2?",
            "userAnswer": "C",
            "correctAnswer": "C",
            "isCorrect": true
        }
    ],
    "nametour": "Gunung Bromosasa",
    "quizId": 1,
    "certificateDownloadUrl": "/api/posts/certificate?name=Sony&course=Gunung%20Bromosasa"
}
```

#### `GET /api/posts/certificate?name=Sony&course=Quiz%201`

Get by ID.

**Response:**

```
Unduh Certidicate
```






















---

### 📦 Products

#### `GET /products`

Retrieve all products.

**Response:**

```json
[
  {
    "id": 101,
    "name": "Apple Watch",
    "price": 299.99
  }
]
```

---

#### `POST /products`

Create a new product.

**Request:**

```json
{
  "name": "New Product",
  "price": 99.99
}
```

**Response:**

```json
{
  "id": 102,
  "name": "New Product",
  "price": 99.99
}
```

---

## ⚠️ Error Format

All error responses will follow this format:

```json
{
  "error": "Error message here"
}
```
