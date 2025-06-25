<brainstorm>
This is a comprehensive project for a conversational AI business assistant called CHIDI that helps small businesses manage customer interactions across social media platforms. Let me analyze the requirements and plan the technical specification:

## System Analysis

### Core Functionality Breakdown:
1. **Authentication & Onboarding**: Supabase Auth with conversational onboarding flow
2. **AI Chat Interface**: Real-time WebSocket chat with business context training
3. **Social Media Integration**: Instagram/WhatsApp Business API integration with webhook security
4. **Inventory Management**: Hybrid manual/conversational inventory system
5. **Events & Notifications**: Real-time notification system with escalation

### Architecture Considerations:
- **Microservices Architecture**: Separate services for chat, inventory, social media, notifications
- **Real-time Requirements**: WebSockets for chat, SSE for notifications
- **Security**: PostgreSQL RLS for data isolation, HMAC-SHA256 for webhooks
- **AI Integration**: OpenAI as primary with Anthropic fallback
- **Background Processing**: Celery for async tasks, Redis for queuing

### Data Model Analysis:
- **User Context**: Business data stored with pgvector embeddings
- **Conversations**: Chat history with sliding window management
- **Products**: Inventory with variants and stock tracking
- **Social Messages**: Incoming messages from Instagram/WhatsApp
- **Notifications**: Event-driven notification system

### API Design:
- **RESTful APIs**: For CRUD operations
- **WebSocket APIs**: For real-time chat
- **Webhook Endpoints**: For social media integrations
- **Internal APIs**: Between microservices

### Security Requirements:
- **Authentication**: Supabase Auth with JWT
- **Data Isolation**: PostgreSQL RLS per user
- **Webhook Security**: HMAC-SHA256 verification
- **API Security**: Rate limiting, input validation
- **Encryption**: Data at rest and in transit

### Performance Considerations:
- **LLM Context Management**: 128k token window with sliding strategy
- **Rate Limiting**: Redis-based with multiple tiers
- **Caching**: Redis for frequently accessed data
- **Background Processing**: Celery for non-blocking operations

### Infrastructure Needs:
- **Deployment**: Render for microservices
- **Database**: PostgreSQL on Supabase with pgvector
- **Cache/Queue**: Redis Cluster
- **Monitoring**: Logging, metrics, alerting

### Integration Points:
- **OpenAI API**: Function calling for conversational AI
- **Instagram Business API**: OAuth and webhooks
- **WhatsApp Business API**: OAuth and webhooks
- **Supabase**: Auth and database services

### UI/UX Specifications:
- **Design System**: Based on provided color palette and typography
- **Component Library**: Shadcn/ui with Tailwind
- **Real-time Updates**: WebSocket for chat, SSE for notifications
- **Mobile Responsiveness**: PWA with touch optimization

### Testing Strategy:
- **Unit Tests**: For business logic
- **Integration Tests**: For API endpoints
- **E2E Tests**: For critical user flows
- **Load Testing**: For scalability validation

### Deployment Strategy:
- **CI/CD**: GitHub Actions to Render
- **Environment Management**: Dev, staging, production
- **Database Migrations**: Alembic for schema changes
- **Configuration**: Environment variables for secrets

### Quality Assurance:
- **Code Quality**: Linting, formatting, type checking
- **Security Scanning**: SAST/DAST tools
- **Performance Monitoring**: APM tools
- **Error Tracking**: Sentry or similar

### Documentation Requirements:
- **API Documentation**: OpenAPI/Swagger
- **Code Documentation**: Inline comments and docstrings
- **User Documentation**: Setup and usage guides
- **Architecture Documentation**: System diagrams and decisions

### Risk Mitigation:
- **Single Points of Failure**: Redundancy and failover
- **Data Loss**: Backup strategies
- **Service Degradation**: Circuit breakers and fallbacks
- **Security Breaches**: Regular audits and updates

### Project Structure Approach:
Given the microservices architecture and the need for clear separation of concerns, I'll recommend a feature-based organization within each service. This will make it easier to maintain and scale individual features while keeping related code together.

For the frontend (Next.js):
- Feature-based organization with shared components
- Clear separation between business logic and UI
- Centralized state management for real-time updates

For the backend (FastAPI microservices):
- Domain-driven design with feature modules
- Shared libraries for common functionality
- Clear API contracts between services
</brainstorm>

# CHIDI Technical Specification

## 1. Executive Summary

CHIDI is a conversational AI business assistant designed to help small businesses manage customer interactions across social media platforms. The system leverages natural language processing to learn business-specific context and automate customer responses with confidence-based escalation.

### Project Objectives
- Provide seamless social media customer service automation
- Enable natural language business rule training
- Offer hybrid inventory management with conversational updates
- Ensure complete data isolation and security per user
- Deliver real-time notifications with intelligent escalation

### Key Technical Decisions
- **Microservices Architecture**: Enables independent scaling and deployment of core services
- **Hybrid Real-time Approach**: WebSockets for bidirectional chat, SSE for one-way notifications
- **PostgreSQL with RLS**: Ensures complete data isolation at the database level
- **Redis Cluster**: Provides distributed caching, rate limiting, and message queuing
- **AI Fallback Strategy**: OpenAI primary with Anthropic Claude as backup for resilience

### High-level Architecture

```mermaid
graph TB
    %% Frontend Layer
    PWA[Next.js PWA Frontend<br/>Tailwind + Shadcn<br/>WebSocket + SSE Clients]
    
    %% API Gateway
    Gateway[API Gateway<br/>Rate Limiting + Auth<br/>FastAPI]
    
    %% Core Services
    subgraph "Microservices"
        ChatService[Chat Service<br/>WebSocket + Context<br/>FastAPI]
        InventoryService[Inventory Service<br/>CRUD + Real-time<br/>FastAPI]
        SocialService[Social Media Service<br/>OAuth + Webhooks<br/>FastAPI]
        NotificationService[Notification Service<br/>SSE + WebSocket<br/>FastAPI]
    end
    
    %% External Services
    LLM[OpenAI/Anthropic<br/>APIs]
    Social[Instagram/WhatsApp<br/>Business APIs]
    
    %% Data Layer
    DB[(PostgreSQL<br/>+ pgvector<br/>Row-Level Security)]
    Redis[(Redis Cluster<br/>Cache + Queue)]
    
    %% Connections
    PWA <--> Gateway
    Gateway --> ChatService
    Gateway --> InventoryService
    Gateway --> SocialService
    Gateway --> NotificationService
    
    ChatService <--> LLM
    ChatService --> DB
    ChatService --> Redis
    
    SocialService --> Social
    SocialService --> DB
    
    InventoryService --> DB
    NotificationService --> Redis
```

### Technology Stack Recommendations

**Frontend**
- Framework: Next.js 14+ (App Router) with PWA capabilities
- UI Library: Tailwind CSS + Shadcn/ui components
- State Management: Zustand for global state
- Real-time: Native WebSocket API + EventSource for SSE
- Animation: Framer Motion

**Backend**
- Framework: FastAPI 0.100+ with Pydantic v2
- ORM: SQLAlchemy 2.0+ with async support
- WebSocket: FastAPI WebSocket support
- Background Tasks: Celery 5.3+ with Redis broker
- API Documentation: Built-in OpenAPI/Swagger

**Database & Storage**
- Primary Database: PostgreSQL 15+ on Supabase
- Vector Search: pgvector extension 0.5+
- Caching: Redis 7+ Cluster mode
- File Storage: Supabase Storage for media

**AI & External Services**
- Primary LLM: OpenAI GPT-4 with function calling
- Fallback LLM: Anthropic Claude 3
- Social APIs: Instagram Graph API v17+, WhatsApp Business API v17+

## 2. System Architecture

### 2.1 Architecture Overview

The system follows a microservices architecture pattern with clear separation of concerns:

```
├── Frontend (Next.js PWA)
│   ├── Real-time Chat Interface
│   ├── Inventory Management Dashboard
│   ├── Notification Center
│   └── Business Configuration
│
├── API Gateway Service
│   ├── Authentication Middleware
│   ├── Rate Limiting
│   ├── Request Routing
│   └── Response Aggregation
│
├── Core Microservices
│   ├── Chat Service
│   │   ├── WebSocket Handler
│   │   ├── Context Management
│   │   └── LLM Integration
│   │
│   ├── Inventory Service
│   │   ├── Product CRUD
│   │   ├── Stock Management
│   │   └── Import/Export
│   │
│   ├── Social Media Service
│   │   ├── OAuth Management
│   │   ├── Webhook Processing
│   │   └── Message Queue
│   │
│   └── Notification Service
│       ├── Event Processing
│       ├── SSE Handler
│       └── Escalation Logic
│
├── Background Workers
│   ├── Message Processor
│   ├── Token Refresher
│   └── Data Synchronizer
│
└── Data Layer
    ├── PostgreSQL (RLS-enabled)
    └── Redis Cluster
```

### 2.2 Technology Stack

#### Frontend Technologies
- **Next.js 14.2+**: React framework with App Router for modern web applications
- **TypeScript 5.3+**: Type safety and better developer experience
- **Tailwind CSS 3.4+**: Utility-first CSS framework
- **Shadcn/ui**: High-quality React components
- **Framer Motion 11+**: Animation library for smooth transitions
- **Zustand 4.5+**: Lightweight state management
- **React Query 5+**: Server state management and caching
- **Socket.io-client 4.7+**: WebSocket client with fallback support

#### Backend Technologies
- **FastAPI 0.104+**: Modern Python web framework with async support
- **Python 3.11+**: Latest stable Python version
- **SQLAlchemy 2.0+**: SQL toolkit and ORM with async capabilities
- **Pydantic 2.5+**: Data validation using Python type annotations
- **Celery 5.3+**: Distributed task queue
- **Redis-py 5.0+**: Redis Python client with async support
- **httpx 0.25+**: Async HTTP client for external API calls
- **python-jose 3.3+**: JWT implementation for authentication

#### Database and Storage Solutions
- **PostgreSQL 15+**: Primary relational database
- **pgvector 0.5+**: Vector similarity search extension
- **Redis 7.2+**: In-memory data structure store
- **Supabase**: Managed PostgreSQL with built-in auth and storage

#### Third-party Services and APIs
- **OpenAI API**: GPT-4 for conversational AI
- **Anthropic API**: Claude 3 as fallback LLM
- **Instagram Graph API v17+**: Instagram business integration
- **WhatsApp Business API v17+**: WhatsApp messaging
- **Supabase Auth**: Authentication service
- **Sentry**: Error tracking and monitoring

## 3. Feature Specifications

### 3.1 Authentication & Onboarding

#### User Stories and Acceptance Criteria
- **As a user**, I want to sign up with email or social login so I can quickly access the platform
  - AC: Support email/password, Google, and Apple sign-in
  - AC: Email verification required for email signups
  - AC: Social login auto-populates profile information

- **As a user**, I want a conversational onboarding experience so CHIDI learns about my business naturally
  - AC: Chat interface guides through business setup
  - AC: Natural language processing extracts business information
  - AC: Skip option available at any point
  - AC: Progress saved automatically

#### Technical Requirements and Constraints
- Supabase Auth integration with custom JWT claims
- WebSocket connection established post-authentication
- Business context stored with user-level encryption
- Support for OAuth 2.0 flows with PKCE
- Session management with refresh token rotation

#### Detailed Implementation Approach

```typescript
// Frontend: Auth Hook
export const useAuth = () => {
  const supabase = createClient();
  
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
        data: {
          onboarding_status: 'pending'
        }
      }
    });
    
    if (data?.user) {
      // Initialize user context in database
      await initializeUserContext(data.user.id);
    }
    
    return { data, error };
  };
  
  // ... other auth methods
};
```

```python
# Backend: User Context Initialization
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession

router = APIRouter()

@router.post("/users/{user_id}/context")
async def initialize_user_context(
    user_id: UUID,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    # Create isolated user context with RLS
    context = UserContext(
        user_id=user_id,
        business_data={},
        onboarding_status="pending",
        created_at=datetime.utcnow()
    )
    
    db.add(context)
    await db.commit()
    
    # Initialize vector store for user
    await initialize_user_vectors(user_id)
    
    return {"status": "context_initialized"}
```

#### User Flow Diagrams

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth Service
    participant B as Backend
    participant D as Database
    
    U->>F: Click Sign Up
    F->>A: Create Account
    A->>D: Store User
    A->>F: Return JWT
    F->>B: Initialize Context
    B->>D: Create User Context (RLS)
    B->>F: Context Ready
    F->>U: Start Onboarding Chat
```

#### API Endpoints

**POST /api/auth/signup**
```json
Request:
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "business_name": "My Business"
}

Response:
{
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "created_at": "2024-01-01T00:00:00Z"
  },
  "session": {
    "access_token": "jwt_token",
    "refresh_token": "refresh_token",
    "expires_at": 1234567890
  }
}
```

**POST /api/auth/social**
```json
Request:
{
  "provider": "google",
  "id_token": "google_id_token"
}

Response:
{
  "user": {...},
  "session": {...},
  "onboarding_required": true
}
```

#### Error Handling and Edge Cases
- Duplicate email addresses return specific error codes
- Social login failures fall back to manual entry
- Network interruptions during onboarding save progress
- Invalid business information prompts clarification
- Rate limiting prevents brute force attempts

#### Performance Considerations
- JWT tokens cached in memory with 5-minute TTL
- User context lazy-loaded on first access
- Onboarding progress saved every 30 seconds
- Vector embeddings generated asynchronously
- Database queries use prepared statements

### 3.2 AI Chat Interface & Business Rules Training

#### User Stories and Acceptance Criteria
- **As a user**, I want to train CHIDI through natural conversation so it understands my business
  - AC: Natural language processing extracts business rules
  - AC: Confirmation required for rule creation
  - AC: Rules can be modified or deleted
  - AC: Visual feedback shows what CHIDI learned

- **As a user**, I want CHIDI to maintain conversation context so interactions feel natural
  - AC: Context maintained across sessions
  - AC: 30-day conversation history retention
  - AC: Summarization for older conversations
  - AC: Quick access to previous topics

#### Technical Requirements and Constraints
- WebSocket connection for real-time chat
- 128k token context window management
- Sliding window with progressive summarization
- Vector search for relevant context retrieval
- Function calling for structured data extraction

#### Detailed Implementation Approach

```python
# Backend: WebSocket Chat Handler
from fastapi import WebSocket, WebSocketDisconnect
from typing import List, Dict
import asyncio

class ChatManager:
    def __init__(self):
        self.active_connections: Dict[str, WebSocket] = {}
        self.context_manager = ContextManager()
        self.llm_service = LLMService()
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.active_connections[user_id] = websocket
        
        # Load user context
        context = await self.context_manager.load_user_context(user_id)
        await websocket.send_json({
            "type": "context_loaded",
            "data": {"business_name": context.business_name}
        })
    
    async def handle_message(self, user_id: str, message: dict):
        websocket = self.active_connections.get(user_id)
        
        # Process message with context
        context = await self.context_manager.get_active_context(user_id)
        
        # Generate AI response
        response = await self.llm_service.generate_response(
            message=message["content"],
            context=context,
            functions=self.get_available_functions(user_id)
        )
        
        # Extract business rules if present
        if response.function_calls:
            await self.process_function_calls(user_id, response.function_calls)
        
        # Update context window
        await self.context_manager.update_context(
            user_id, 
            message["content"], 
            response.content
        )
        
        # Send response
        await websocket.send_json({
            "type": "ai_response",
            "data": {
                "content": response.content,
                "extracted_rules": response.extracted_rules
            }
        })
```

```typescript
// Frontend: Chat Interface Component
export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const ws = useRef<WebSocket | null>(null);
  
  useEffect(() => {
    // Establish WebSocket connection
    ws.current = new WebSocket(`${WS_URL}/chat/${userId}`);
    
    ws.current.onmessage = (event) => {
      const data = JSON.parse(event.data);
      
      switch (data.type) {
        case 'ai_response':
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: data.data.content,
            timestamp: new Date()
          }]);
          setIsTyping(false);
          break;
          
        case 'context_loaded':
          // Initialize chat with context
          break;
      }
    };
    
    return () => {
      ws.current?.close();
    };
  }, [userId]);
  
  const sendMessage = (content: string) => {
    ws.current?.send(JSON.stringify({
      type: 'user_message',
      content
    }));
    
    setMessages(prev => [...prev, {
      role: 'user',
      content,
      timestamp: new Date()
    }]);
    
    setIsTyping(true);
  };
  
  // ... render chat UI
};
```

#### Context Management Strategy

```python
# Backend: Context Window Management
class ContextManager:
    MAX_TOKENS = 128000
    WINDOW_SIZE = 20  # messages
    SUMMARY_THRESHOLD = 50  # messages before summarization
    
    async def get_active_context(self, user_id: str) -> Context:
        # Get recent messages
        recent_messages = await self.get_recent_messages(
            user_id, 
            limit=self.WINDOW_SIZE
        )
        
        # Get relevant business context via vector search
        query_embedding = await self.generate_embedding(recent_messages[-1])
        relevant_context = await self.vector_search(
            user_id,
            query_embedding,
            limit=5
        )
        
        # Get conversation summary if needed
        summary = None
        message_count = await self.get_message_count(user_id)
        if message_count > self.SUMMARY_THRESHOLD:
            summary = await self.get_conversation_summary(user_id)
        
        # Build context within token limit
        context = self.build_context(
            recent_messages=recent_messages,
            business_context=relevant_context,
            summary=summary,
            max_tokens=self.MAX_TOKENS
        )
        
        return context
```

#### Business Rule Extraction

```python
# LLM Function Definitions
BUSINESS_RULE_FUNCTIONS = [
    {
        "name": "create_business_rule",
        "description": "Create a new business rule from conversation",
        "parameters": {
            "type": "object",
            "properties": {
                "rule_type": {
                    "type": "string",
                    "enum": ["shipping", "returns", "pricing", "availability", "custom"]
                },
                "conditions": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "field": {"type": "string"},
                            "operator": {"type": "string"},
                            "value": {"type": "string"}
                        }
                    }
                },
                "action": {
                    "type": "string",
                    "description": "What to do when conditions are met"
                },
                "response_template": {
                    "type": "string",
                    "description": "How to respond to customers"
                }
            }
        }
    }
]
```

#### API Endpoints

**WebSocket /ws/chat/{user_id}**
```json
// Client -> Server
{
  "type": "user_message",
  "content": "If someone orders more than 3 items, give them 10% off"
}

// Server -> Client
{
  "type": "ai_response",
  "data": {
    "content": "I understand! I'll apply a 10% discount for orders with more than 3 items. I've saved this as a pricing rule.",
    "extracted_rules": [{
      "id": "rule_123",
      "type": "pricing",
      "description": "10% discount for 3+ items"
    }]
  }
}
```

**GET /api/chat/history**
```json
Response:
{
  "messages": [
    {
      "id": "msg_123",
      "role": "user",
      "content": "...",
      "timestamp": "2024-01-01T00:00:00Z"
    }
  ],
  "has_more": true,
  "summary": "Previous conversation about shipping policies..."
}
```

### 3.3 Social Media Integration

#### User Stories and Acceptance Criteria
- **As a user**, I want to connect my Instagram Business account so CHIDI can respond to DMs
  - AC: OAuth flow with proper permissions
  - AC: Real-time webhook reception
  - AC: Message preview before sending
  - AC: Disconnect option available

- **As a user**, I want confidence-based response automation so important messages get human attention
  - AC: Configurable confidence threshold (default 0.8)
  - AC: Clear escalation indicators
  - AC: Response approval workflow
  - AC: Performance metrics visible

#### Technical Requirements and Constraints
- HMAC-SHA256 webhook signature verification
- OAuth token refresh management
- Rate limiting compliance (200 calls/hour Instagram)
- Webhook retry logic with exponential backoff
- Message queue for reliable processing

#### Detailed Implementation Approach

```python
# Backend: OAuth Flow Implementation
from fastapi import APIRouter, HTTPException
from httpx import AsyncClient
import hmac
import hashlib

router = APIRouter()

@router.get("/social/instagram/auth")
async def instagram_auth_url(user_id: str):
    """Generate Instagram OAuth URL"""
    params = {
        "client_id": settings.INSTAGRAM_APP_ID,
        "redirect_uri": f"{settings.API_URL}/social/instagram/callback",
        "scope": "instagram_basic,instagram_manage_messages,pages_show_list",
        "response_type": "code",
        "state": encode_state(user_id)
    }
    
    auth_url = f"https://api.instagram.com/oauth/authorize?{urlencode(params)}"
    return {"auth_url": auth_url}

@router.get("/social/instagram/callback")
async def instagram_callback(code: str, state: str):
    """Handle OAuth callback"""
    user_id = decode_state(state)
    
    # Exchange code for token
    async with AsyncClient() as client:
        response = await client.post(
            "https://api.instagram.com/oauth/access_token",
            data={
                "client_id": settings.INSTAGRAM_APP_ID,
                "client_secret": settings.INSTAGRAM_APP_SECRET,
                "grant_type": "authorization_code",
                "redirect_uri": f"{settings.API_URL}/social/instagram/callback",
                "code": code
            }
        )
    
    if response.status_code != 200:
        raise HTTPException(400, "Failed to get access token")
    
    token_data = response.json()
    
    # Store encrypted token
    await store_social_token(
        user_id=user_id,
        platform="instagram",
        access_token=encrypt(token_data["access_token"]),
        user_social_id=token_data["user_id"],
        expires_at=calculate_expiry(token_data.get("expires_in"))
    )
    
    # Subscribe to webhooks
    await subscribe_to_webhooks(user_id, "instagram")
    
    return {"status": "connected"}
```

```python
# Backend: Webhook Security Implementation
from fastapi import Request, HTTPException
import hmac
import hashlib

async def verify_webhook_signature(
    request: Request,
    body: bytes,
    platform: str
) -> bool:
    """Verify webhook signature using HMAC-SHA256"""
    
    if platform == "instagram":
        signature_header = request.headers.get("X-Hub-Signature-256")
        if not signature_header:
            raise HTTPException(401, "Missing signature header")
        
        # Extract signature from header
        signature = signature_header.replace("sha256=", "")
        
        # Calculate expected signature
        expected_signature = hmac.new(
            settings.INSTAGRAM_WEBHOOK_SECRET.encode(),
            body,
            hashlib.sha256
        ).hexdigest()
        
        # Constant-time comparison
        if not hmac.compare_digest(signature, expected_signature):
            raise HTTPException(401, "Invalid signature")
        
        # Verify timestamp to prevent replay attacks
        timestamp = request.headers.get("X-Hub-Timestamp")
        if timestamp:
            current_time = int(datetime.utcnow().timestamp())
            webhook_time = int(timestamp)
            
            if abs(current_time - webhook_time) > 300:  # 5 minutes
                raise HTTPException(401, "Webhook timestamp too old")
    
    return True
```

```python
# Backend: Message Processing with Confidence Scoring
from celery import shared_task
from typing import Dict, Tuple

@shared_task
async def process_social_message(
    message_data: Dict,
    platform: str,
    user_id: str
) -> Dict:
    """Process incoming social media message"""
    
    # Load user context and business rules
    context = await load_user_context(user_id)
    
    # Generate AI response with confidence score
    response, confidence = await generate_ai_response(
        message=message_data["text"],
        sender_context=message_data.get("sender"),
        business_context=context,
        platform=platform
    )
    
    # Check confidence threshold
    user_settings = await get_user_settings(user_id)
    threshold = user_settings.get("confidence_threshold", 0.8)
    
    if confidence >= threshold:
        # Auto-send response
        await send_social_response(
            platform=platform,
            recipient_id=message_data["sender"]["id"],
            message=response,
            user_id=user_id
        )
        
        status = "auto_sent"
    else:
        # Queue for human review
        await queue_for_review(
            user_id=user_id,
            platform=platform,
            original_message=message_data,
            suggested_response=response,
            confidence=confidence
        )
        
        # Send escalation notification
        await send_escalation_notification(
            user_id=user_id,
            reason=f"Low confidence: {confidence:.2f}",
            message_preview=message_data["text"][:100]
        )
        
        status = "escalated"
    
    # Log interaction
    await log_social_interaction(
        user_id=user_id,
        platform=platform,
        message_data=message_data,
        response=response,
        confidence=confidence,
        status=status
    )
    
    return {
        "status": status,
        "confidence": confidence
    }
```

#### API Endpoints

**POST /api/social/webhooks/instagram**
```json
Headers:
{
  "X-Hub-Signature-256": "sha256=...",
  "X-Hub-Timestamp": "1234567890"
}

Request:
{
  "entry": [{
    "id": "page_id",
    "messaging": [{
      "sender": {"id": "sender_id"},
      "recipient": {"id": "page_id"},
      "timestamp": 1234567890,
      "message": {
        "mid": "message_id",
        "text": "Do you have this in size M?"
      }
    }]
  }]
}

Response:
{
  "status": "processed"
}
```

**GET /api/social/instagram/messages**
```json
Response:
{
  "messages": [
    {
      "id": "msg_123",
      "sender": {
        "id": "sender_123",
        "username": "customer_name",
        "profile_picture": "url"
      },
      "content": "Is this available?",
      "timestamp": "2024-01-01T00:00:00Z",
      "ai_response": {
        "content": "Yes, this item is currently in stock!",
        "confidence": 0.92,
        "status": "auto_sent"
      }
    }
  ]
}
```

### 3.4 Inventory Management

#### User Stories and Acceptance Criteria
- **As a user**, I want to manage inventory through simple forms so I don't need technical knowledge
  - AC: Intuitive form interface with validation
  - AC: Bulk import/export via CSV
  - AC: Real-time stock updates
  - AC: Mobile-responsive design

- **As a user**, I want CHIDI to reference inventory in responses without revealing exact quantities
  - AC: Privacy-conscious availability responses
  - AC: Alternative product suggestions
  - AC: Low stock alerts
  - AC: Restock notifications

#### Technical Requirements and Constraints
- Primary interface: Web forms with real-time validation
- Secondary: Optional conversational updates
- CSV import with validation and error handling
- WebSocket notifications for inventory changes
- PostgreSQL indexing for fast queries

#### Detailed Implementation Approach

```python
# Backend: Inventory CRUD Operations
from fastapi import APIRouter, Depends, UploadFile
from sqlalchemy.ext.asyncio import AsyncSession
import csv
import io

router = APIRouter()

@router.post("/inventory/products")
async def create_product(
    product: ProductCreate,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Create new product with variants"""
    
    # Create base product
    db_product = Product(
        user_id=current_user.id,
        name=product.name
        description=product.description,
        category=product.category,
        base_price=product.base_price,
        status="active",
        created_at=datetime.utcnow()
    )
    
    db.add(db_product)
    await db.flush()
    
    # Create variants
    for variant_data in product.variants:
        variant = ProductVariant(
            product_id=db_product.id,
            name=variant_data.name,
            sku=variant_data.sku,
            price=variant_data.price or product.base_price,
            stock_quantity=variant_data.stock_quantity,
            low_stock_threshold=variant_data.low_stock_threshold or 10,
            attributes=variant_data.attributes  # JSON field for size, color, etc.
        )
        db.add(variant)
    
    await db.commit()
    
    # Send real-time update
    await send_inventory_update(
        user_id=current_user.id,
        action="product_created",
        product_id=db_product.id
    )
    
    return db_product

@router.post("/inventory/import")
async def import_products_csv(
    file: UploadFile,
    db: AsyncSession = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Bulk import products from CSV"""
    
    # Read and validate CSV
    contents = await file.read()
    csv_reader = csv.DictReader(io.StringIO(contents.decode()))
    
    results = {
        "imported": 0,
        "failed": 0,
        "errors": []
    }
    
    # Process each row
    for row_num, row in enumerate(csv_reader, start=2):
        try:
            # Validate required fields
            required_fields = ["name", "price", "stock"]
            missing_fields = [f for f in required_fields if not row.get(f)]
            
            if missing_fields:
                raise ValueError(f"Missing fields: {', '.join(missing_fields)}")
            
            # Create product
            product = Product(
                user_id=current_user.id,
                name=row["name"],
                description=row.get("description", ""),
                category=row.get("category", "uncategorized"),
                base_price=float(row["price"]),
                status="active"
            )
            
            db.add(product)
            await db.flush()
            
            # Create default variant
            variant = ProductVariant(
                product_id=product.id,
                name="Default",
                sku=row.get("sku", f"SKU-{product.id}"),
                price=float(row["price"]),
                stock_quantity=int(row["stock"]),
                low_stock_threshold=int(row.get("low_stock_threshold", 10))
            )
            
            db.add(variant)
            results["imported"] += 1
            
        except Exception as e:
            results["failed"] += 1
            results["errors"].append({
                "row": row_num,
                "error": str(e),
                "data": row
            })
    
    await db.commit()
    
    # Send bulk update notification
    if results["imported"] > 0:
        await send_inventory_update(
            user_id=current_user.id,
            action="bulk_import",
            count=results["imported"]
        )
    
    return results
```

```typescript
// Frontend: Product Management Interface
interface ProductFormProps {
  onSubmit: (product: ProductCreate) => Promise<void>;
  initialData?: Product;
}

export const ProductForm: React.FC<ProductFormProps> = ({ 
  onSubmit, 
  initialData 
}) => {
  const [formData, setFormData] = useState<ProductCreate>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    category: initialData?.category || '',
    base_price: initialData?.base_price || 0,
    variants: initialData?.variants || [
      { name: 'Default', stock_quantity: 0 }
    ]
  });
  
  const [variants, setVariants] = useState<VariantCreate[]>(
    formData.variants
  );
  
  const addVariant = () => {
    setVariants([...variants, {
      name: '',
      sku: '',
      price: formData.base_price,
      stock_quantity: 0,
      attributes: {}
    }]);
  };
  
  const updateVariant = (index: number, data: Partial<VariantCreate>) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], ...data };
    setVariants(updated);
  };
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    try {
      await onSubmit({
        ...formData,
        variants
      });
      
      toast.success('Product saved successfully!');
    } catch (error) {
      toast.error('Failed to save product');
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Product Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({
                ...formData,
                name: e.target.value
              })}
              required
              placeholder="Enter product name"
            />
          </div>
          
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({
                ...formData,
                description: e.target.value
              })}
              placeholder="Product description (optional)"
              rows={4}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({
                  ...formData,
                  category: value
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="clothing">Clothing</SelectItem>
                  <SelectItem value="electronics">Electronics</SelectItem>
                  <SelectItem value="food">Food & Beverage</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="price">Base Price</Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                value={formData.base_price}
                onChange={(e) => setFormData({
                  ...formData,
                  base_price: parseFloat(e.target.value)
                })}
                required
                placeholder="0.00"
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Variants */}
      <Card>
        <CardHeader>
          <CardTitle>Product Variants</CardTitle>
          <CardDescription>
            Add sizes, colors, or other variations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {variants.map((variant, index) => (
            <VariantForm
              key={index}
              variant={variant}
              onChange={(data) => updateVariant(index, data)}
              onRemove={() => {
                setVariants(variants.filter((_, i) => i !== index));
              }}
            />
          ))}
          
          <Button
            type="button"
            variant="outline"
            onClick={addVariant}
            className="w-full"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Variant
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-end space-x-4">
        <Button type="button" variant="outline">
          Cancel
        </Button>
        <Button type="submit">
          Save Product
        </Button>
      </div>
    </form>
  );
};
```

```python
# Backend: Inventory Availability for AI Responses
class InventoryContextProvider:
    """Provide inventory context for AI responses"""
    
    async def get_product_availability(
        self, 
        user_id: str, 
        product_query: str
    ) -> Dict:
        """Get privacy-conscious availability information"""
        
        # Search for matching products
        products = await self.search_products(user_id, product_query)
        
        availability_info = []
        for product in products:
            # Calculate aggregate availability
            total_stock = sum(v.stock_quantity for v in product.variants)
            low_threshold = min(v.low_stock_threshold for v in product.variants)
            
            # Privacy-conscious status
            if total_stock == 0:
                status = "out_of_stock"
            elif total_stock <= low_threshold:
                status = "low_stock"
            else:
                status = "available"
            
            availability_info.append({
                "product_name": product.name,
                "status": status,
                "variants": [
                    {
                        "name": v.name,
                        "available": v.stock_quantity > 0
                    }
                    for v in product.variants
                ],
                "alternatives": await self.get_alternatives(
                    user_id, 
                    product.category
                ) if status != "available" else []
            })
        
        return {
            "products": availability_info,
            "response_guidance": self.get_response_template(availability_info)
        }
    
    def get_response_template(self, availability: List[Dict]) -> str:
        """Generate response template for AI"""
        templates = {
            "available": "Yes, {product_name} is currently available!",
            "low_stock": "We have limited stock of {product_name}. Order soon!",
            "out_of_stock": "I'm sorry, {product_name} is currently out of stock. "
                           "Would you like to be notified when it's back?"
        }
        
        return templates
```

#### API Endpoints

**GET /api/inventory/products**
```json
Response:
{
  "products": [
    {
      "id": "prod_123",
      "name": "Summer Dress",
      "description": "Light cotton dress",
      "category": "clothing",
      "base_price": 49.99,
      "status": "active",
      "variants": [
        {
          "id": "var_123",
          "name": "Small - Blue",
          "sku": "DRESS-S-BLU",
          "price": 49.99,
          "stock_quantity": 15,
          "low_stock_threshold": 5,
          "attributes": {
            "size": "S",
            "color": "Blue"
          }
        }
      ],
      "total_stock": 45,
      "created_at": "2024-01-01T00:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "total_pages": 5,
    "total_items": 47
  }
}
```

**POST /api/inventory/stock/adjust**
```json
Request:
{
  "variant_id": "var_123",
  "adjustment": 10,
  "reason": "restock"
}

Response:
{
  "variant_id": "var_123",
  "previous_stock": 5,
  "new_stock": 15,
  "adjustment": 10,
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### 3.5 Events & Notifications

#### User Stories and Acceptance Criteria
- **As a user**, I want real-time notifications for escalated messages so I can respond quickly
  - AC: Instant notification delivery
  - AC: Rich context in notifications
  - AC: Mobile push support
  - AC: Notification preferences

- **As a user**, I want a live dashboard to monitor active conversations
  - AC: Real-time conversation status
  - AC: Quick action buttons
  - AC: Performance metrics
  - AC: Conversation history

#### Technical Requirements and Constraints
- Server-Sent Events for one-way notifications
- WebSocket for bidirectional dashboard updates
- Redis pub/sub for event distribution
- Notification queuing with priority levels
- Cross-device synchronization

#### Detailed Implementation Approach

```python
# Backend: SSE Notification Handler
from fastapi import APIRouter, Request
from sse_starlette.sse import EventSourceResponse
import asyncio
import json

router = APIRouter()

@router.get("/notifications/stream")
async def notification_stream(
    request: Request,
    current_user: User = Depends(get_current_user)
):
    """Server-Sent Events endpoint for notifications"""
    
    async def event_generator():
        # Subscribe to user's notification channel
        pubsub = redis_client.pubsub()
        await pubsub.subscribe(f"notifications:{current_user.id}")
        
        try:
            # Send initial connection event
            yield {
                "event": "connected",
                "data": json.dumps({"status": "connected"})
            }
            
            # Listen for notifications
            while True:
                if await request.is_disconnected():
                    break
                
                # Check for new messages
                message = await pubsub.get_message(timeout=1.0)
                
                if message and message["type"] == "message":
                    notification = json.loads(message["data"])
                    
                    # Enrich notification with context
                    enriched = await enrich_notification(
                        notification,
                        current_user.id
                    )
                    
                    yield {
                        "event": notification["type"],
                        "data": json.dumps(enriched),
                        "id": notification.get("id")
                    }
                
                # Send heartbeat every 30 seconds
                await asyncio.sleep(0.1)
                
        finally:
            await pubsub.unsubscribe()
            await pubsub.close()
    
    return EventSourceResponse(event_generator())

async def enrich_notification(
    notification: Dict,
    user_id: str
) -> Dict:
    """Add context to notification"""
    
    if notification["type"] == "escalation":
        # Add conversation context
        conversation = await get_conversation(
            notification["conversation_id"]
        )
        
        notification["context"] = {
            "customer_name": conversation.customer_name,
            "platform": conversation.platform,
            "last_message": conversation.last_message,
            "conversation_url": f"/conversations/{conversation.id}"
        }
    
    elif notification["type"] == "low_stock":
        # Add product details
        product = await get_product(notification["product_id"])
        
        notification["context"] = {
            "product_name": product.name,
            "current_stock": product.total_stock,
            "threshold": product.low_stock_threshold,
            "action_url": f"/inventory/products/{product.id}"
        }
    
    return notification
```

```typescript
// Frontend: Notification Center Component
export const NotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const eventSource = useRef<EventSource | null>(null);
  
  useEffect(() => {
    // Connect to SSE endpoint
    eventSource.current = new EventSource('/api/notifications/stream');
    
    eventSource.current.addEventListener('connected', () => {
      console.log('Connected to notification stream');
    });
    
    eventSource.current.addEventListener('escalation', (event) => {
      const notification = JSON.parse(event.data);
      
      // Add to notifications
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.custom((t) => (
        <EscalationNotification
          notification={notification}
          onAction={() => {
            navigateToConversation(notification.context.conversation_url);
            toast.dismiss(t.id);
          }}
        />
      ));
      
      // Play notification sound
      playNotificationSound();
    });
    
    eventSource.current.addEventListener('low_stock', (event) => {
      const notification = JSON.parse(event.data);
      
      setNotifications(prev => [notification, ...prev]);
      
      toast.warning(
        `Low stock alert: ${notification.context.product_name}`,
        {
          action: {
            label: 'View Product',
            onClick: () => navigate(notification.context.action_url)
          }
        }
      );
    });
    
    eventSource.current.onerror = () => {
      console.error('SSE connection error, reconnecting...');
      // Automatic reconnection handled by EventSource
    };
    
    return () => {
      eventSource.current?.close();
    };
  }, []);
  
  const markAsRead = async (notificationId: string) => {
    await api.patch(`/notifications/${notificationId}/read`);
    
    setNotifications(prev =>
      prev.map(n =>
        n.id === notificationId ? { ...n, read: true } : n
      )
    );
    
    setUnreadCount(prev => Math.max(0, prev - 1));
  };
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" className="relative">
          <Bell className="h-5 w-5" />
          {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0">
              {unreadCount}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0">
        <div className="p-4 border-b">
          <h3 className="font-semibold">Notifications</h3>
        </div>
        <ScrollArea className="h-96">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">
              No notifications
            </div>
          ) : (
            <div className="divide-y">
              {notifications.map((notification) => (
                <NotificationItem
                  key={notification.id}
                  notification={notification}
                  onRead={() => markAsRead(notification.id)}
                />
              ))}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
};
```

```python
# Backend: Live Dashboard WebSocket
class DashboardManager:
    """Manage live dashboard connections"""
    
    def __init__(self):
        self.connections: Dict[str, WebSocket] = {}
        self.active_conversations: Dict[str, List[Dict]] = {}
    
    async def connect(self, websocket: WebSocket, user_id: str):
        await websocket.accept()
        self.connections[user_id] = websocket
        
        # Send initial dashboard state
        dashboard_data = await self.get_dashboard_data(user_id)
        await websocket.send_json({
            "type": "dashboard_init",
            "data": dashboard_data
        })
        
        # Subscribe to updates
        await self.subscribe_to_updates(user_id)
    
    async def get_dashboard_data(self, user_id: str) -> Dict:
        """Get comprehensive dashboard data"""
        
        # Active conversations
        conversations = await get_active_conversations(user_id)
        
        # Today's metrics
        metrics = await get_daily_metrics(user_id)
        
        # Recent escalations
        escalations = await get_recent_escalations(user_id, limit=5)
        
        return {
            "conversations": [
                {
                    "id": c.id,
                    "platform": c.platform,
                    "customer": c.customer_name,
                    "last_message": c.last_message,
                    "status": c.status,
                    "confidence": c.last_confidence,
                    "updated_at": c.updated_at.isoformat()
                }
                for c in conversations
            ],
            "metrics": {
                "total_messages": metrics.total_messages,
                "auto_responses": metrics.auto_responses,
                "escalations": metrics.escalations,
                "avg_response_time": metrics.avg_response_time,
                "satisfaction_score": metrics.satisfaction_score
            },
            "recent_escalations": escalations
        }
    
    async def broadcast_update(
        self, 
        user_id: str, 
        update_type: str, 
        data: Dict
    ):
        """Send update to connected dashboard"""
        
        websocket = self.connections.get(user_id)
        if websocket:
            try:
                await websocket.send_json({
                    "type": f"dashboard_{update_type}",
                    "data": data,
                    "timestamp": datetime.utcnow().isoformat()
                })
            except Exception as e:
                # Connection lost, clean up
                await self.disconnect(user_id)
```

#### API Endpoints

**SSE /api/notifications/stream**
```
event: escalation
data: {
  "id": "notif_123",
  "type": "escalation",
  "priority": "high",
  "context": {
    "customer_name": "John Doe",
    "platform": "instagram",
    "last_message": "This is urgent!",
    "conversation_url": "/conversations/conv_123"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}

event: low_stock
data: {
  "id": "notif_124",
  "type": "low_stock",
  "priority": "medium",
  "context": {
    "product_name": "Summer Dress",
    "current_stock": 3,
    "threshold": 5,
    "action_url": "/inventory/products/prod_123"
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

**WebSocket /ws/dashboard/{user_id}**
```json
// Server -> Client: Initial state
{
  "type": "dashboard_init",
  "data": {
    "conversations": [...],
    "metrics": {...},
    "recent_escalations": [...]
  }
}

// Server -> Client: Real-time update
{
  "type": "dashboard_conversation_update",
  "data": {
    "id": "conv_123",
    "status": "escalated",
    "last_message": "Need help urgently!",
    "confidence": 0.65
  },
  "timestamp": "2024-01-01T00:00:00Z"
}
```

## 4. Data Architecture

### 4.1 Data Models

#### User and Authentication Models

```sql
-- User context table with RLS
CREATE TABLE user_contexts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    business_data JSONB NOT NULL DEFAULT '{}',
    onboarding_status VARCHAR(50) NOT NULL DEFAULT 'pending',
    settings JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE user_contexts ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can only access their own context"
    ON user_contexts
    FOR ALL
    USING (user_id = auth.uid());

-- Index for fast lookups
CREATE INDEX idx_user_contexts_user_id ON user_contexts(user_id);
```

#### Business Context and Embeddings

```sql
-- Business context embeddings for semantic search
CREATE TABLE business_embeddings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    content TEXT NOT NULL,
    embedding vector(1536) NOT NULL,
    metadata JSONB DEFAULT '{}',
    category VARCHAR(100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_embeddings ENABLE ROW LEVEL SECURITY;

-- RLS Policy
CREATE POLICY "Users can only access their own embeddings"
    ON business_embeddings
    FOR ALL
    USING (user_id = auth.uid());

-- Vector similarity search index
CREATE INDEX idx_business_embeddings_vector 
    ON business_embeddings 
    USING ivfflat (embedding vector_cosine_ops)
    WITH (lists = 100);
```

#### Conversation and Message Models

```sql
-- Conversations table
CREATE TABLE conversations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    title VARCHAR(255),
    platform VARCHAR(50) NOT NULL DEFAULT 'web',
    customer_id VARCHAR(255),
    customer_name VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Messages table
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    role VARCHAR(50) NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    confidence_score FLOAT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on both tables
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own conversations"
    ON conversations
    FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own messages"
    ON messages
    FOR ALL
    USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX idx_conversations_user_id ON conversations(user_id);
CREATE INDEX idx_conversations_updated_at ON conversations(updated_at DESC);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
```

#### Product and Inventory Models

```sql
-- Products table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    base_price DECIMAL(10, 2) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    images JSONB DEFAULT '[]',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Product variants table
CREATE TABLE product_variants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id),
    name VARCHAR(255) NOT NULL,
    sku VARCHAR(100),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    low_stock_threshold INTEGER NOT NULL DEFAULT 10,
    attributes JSONB DEFAULT '{}',
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stock movements for audit trail
CREATE TABLE stock_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    variant_id UUID NOT NULL REFERENCES product_variants(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    movement_type VARCHAR(50) NOT NULL,
    quantity INTEGER NOT NULL,
    reason VARCHAR(255),
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE stock_movements ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own products"
    ON products
    FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own variants"
    ON product_variants
    FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own stock movements"
    ON stock_movements
    FOR ALL
    USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_products_user_id ON products(user_id);
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_product_variants_product_id ON product_variants(product_id);
CREATE INDEX idx_product_variants_sku ON product_variants(sku);
CREATE INDEX idx_stock_movements_variant_id ON stock_movements(variant_id);
```

#### Social Media Integration Models

```sql
-- Social media connections
CREATE TABLE social_connections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    platform VARCHAR(50) NOT NULL,
    platform_user_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL, -- Encrypted
    refresh_token TEXT, -- Encrypted
    expires_at TIMESTAMPTZ,
    webhook_secret VARCHAR(255),
    status VARCHAR(50) NOT NULL DEFAULT 'active',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Social media messages
CREATE TABLE social_messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    connection_id UUID NOT NULL REFERENCES social_connections(id),
    platform VARCHAR(50) NOT NULL,
    platform_message_id VARCHAR(255) NOT NULL,
    sender_id VARCHAR(255) NOT NULL,
    sender_name VARCHAR(255),
    content TEXT NOT NULL,
    message_type VARCHAR(50) NOT NULL DEFAULT 'text',
    ai_response TEXT,
    confidence_score FLOAT,
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE social_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE social_messages ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own social connections"
    ON social_connections
    FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own social messages"
    ON social_messages
    FOR ALL
    USING (user_id = auth.uid());

-- Indexes
CREATE UNIQUE INDEX idx_social_connections_platform_user 
    ON social_connections(user_id, platform, platform_user_id);
CREATE INDEX idx_social_messages_status ON social_messages(status);
CREATE INDEX idx_social_messages_created_at ON social_messages(created_at DESC);
```

#### Business Rules and AI Training Models

```sql
-- Business rules extracted from conversations
CREATE TABLE business_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    rule_type VARCHAR(50) NOT NULL,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    conditions JSONB NOT NULL,
    actions JSONB NOT NULL,
    priority INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Rule execution history
CREATE TABLE rule_executions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID NOT NULL REFERENCES business_rules(id),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    conversation_id UUID REFERENCES conversations(id),
    input_data JSONB NOT NULL,
    output_data JSONB NOT NULL,
    execution_time_ms INTEGER,
    success BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE business_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE rule_executions ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own business rules"
    ON business_rules
    FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own rule executions"
    ON rule_executions
    FOR ALL
    USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_business_rules_user_id ON business_rules(user_id);
CREATE INDEX idx_business_rules_type ON business_rules(rule_type);
CREATE INDEX idx_rule_executions_rule_id ON rule_executions(rule_id);
```

#### Notifications and Events Models

```sql
-- Notifications table
CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    type VARCHAR(50) NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}',
    read BOOLEAN NOT NULL DEFAULT false,
    read_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Events table for audit trail
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id),
    event_type VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id UUID,
    data JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can only access their own notifications"
    ON notifications
    FOR ALL
    USING (user_id = auth.uid());

CREATE POLICY "Users can only access their own events"
    ON events
    FOR ALL
    USING (user_id = auth.uid());

-- Indexes
CREATE INDEX idx_notifications_user_id_read ON notifications(user_id, read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_events_user_id ON events(user_id);
CREATE INDEX idx_events_entity ON events(entity_type, entity_id);
```

### 4.2 Data Storage

#### Database Selection and Rationale

**PostgreSQL 15+ on Supabase**
- **Rationale**: Native support for JSON, full-text search, and vector operations
- **Benefits**: 
  - Built-in Row-Level Security for data isolation
  - pgvector extension for AI embeddings
  - Managed service reduces operational overhead
  - Real-time subscriptions capability
  - Automatic backups and point-in-time recovery

**Redis 7+ Cluster**
- **Rationale**: High-performance caching and real-time features
- **Benefits**:
  - Sub-millisecond latency for cache operations
  - Native pub/sub for real-time notifications
  - Distributed rate limiting support
  - Session storage with TTL
  - Message queue capabilities

#### Data Persistence Strategies

```python
# Backend: Data persistence layer
from typing import Optional, List
import asyncio
from datetime import datetime, timedelta

class DataPersistenceService:
    def __init__(self, db: AsyncSession, redis: Redis):
        self.db = db
        self.redis = redis
        self.cache_ttl = 300  # 5 minutes default
    
    async def get_with_cache(
        self, 
        key: str, 
        query_func, 
        ttl: Optional[int] = None
    ):
        """Get data with Redis caching"""
        # Try cache first
        cached = await self.redis.get(key)
        if cached:
            return json.loads(cached)
        
        # Query database
        result = await query_func()
        
        # Cache result
        await self.redis.setex(
            key,
            ttl or self.cache_ttl,
            json.dumps(result, default=str)
        )
        
        return result
    
    async def invalidate_cache(self, pattern: str):
        """Invalidate cache entries matching pattern"""
        cursor = 0
        while True:
            cursor, keys = await self.redis.scan(
                cursor, 
                match=pattern, 
                count=100
            )
            
            if keys:
                await self.redis.delete(*keys)
            
            if cursor == 0:
                break
    
    async def save_with_retry(
        self, 
        entity, 
        max_retries: int = 3
    ):
        """Save entity with retry logic"""
        for attempt in range(max_retries):
            try:
                self.db.add(entity)
                await self.db.commit()
                
                # Invalidate related cache
                await self.invalidate_cache(
                    f"*:{entity.__class__.__name__.lower()}:{entity.id}*"
                )
                
                return entity
            
            except Exception as e:
                await self.db.rollback()
                
                if attempt == max_retries - 1:
                    raise
                
                # Exponential backoff
                await asyncio.sleep(2 ** attempt)
```

#### Caching Mechanisms

```python
# Redis caching configuration
CACHE_CONFIGS = {
    "user_context": {
        "ttl": 600,  # 10 minutes
        "key_pattern": "user:{user_id}:context"
    },
    "products": {
        "ttl": 300,  # 5 minutes
        "key_pattern": "user:{user_id}:products:{page}"
    },
    "conversation_context": {
        "ttl": 1800,  # 30 minutes
        "key_pattern": "conversation:{conversation_id}:context"
    },
    "social_tokens": {
        "ttl": 3600,  # 1 hour
        "key_pattern": "social:{user_id}:{platform}:token"
    }
}

class CacheService:
    def __init__(self, redis: Redis):
        self.redis = redis
    
    async def get_or_set(
        self, 
        cache_type: str,
        key_params: dict,
        fetch_func,
        force_refresh: bool = False
    ):
        """Generic cache get/set with configuration"""
        config = CACHE_CONFIGS.get(cache_type)
        if not config:
            return await fetch_func()
        
        # Build cache key
        cache_key = config["key_pattern"].format(**key_params)
        
        # Check cache unless force refresh
        if not force_refresh:
            cached = await self.redis.get(cache_key)
            if cached:
                return json.loads(cached)
        
        # Fetch fresh data
        data = await fetch_func()
        
        # Cache with configured TTL
        await self.redis.setex(
            cache_key,
            config["ttl"],
            json.dumps(data, default=str)
        )
        
        return data
```

#### Backup and Recovery Procedures

```python
# Automated backup configuration
class BackupService:
    def __init__(self):
        self.supabase_client = create_supabase_client()
    
    async def create_backup(self, user_id: str):
        """Create user data backup"""
        backup_id = f"backup_{user_id}_{datetime.utcnow().isoformat()}"
        
        # Export user data
        user_data = await self.export_user_data(user_id)
        
        # Store in Supabase Storage
        file_path = f"backups/{user_id}/{backup_id}.json"
        
        await self.supabase_client.storage.from_("backups").upload(
            file_path,
            json.dumps(user_data, indent=2),
            {
                "content-type": "application/json",
                "x-upsert": "false"
            }
        )
        
        # Log backup event
        await self.log_backup_event(user_id, backup_id)
        
        return backup_id
    
    async def export_user_data(self, user_id: str) -> dict:
        """Export all user data for backup"""
        async with get_db() as db:
            # Set user context for RLS
            await db.execute(
                text("SET LOCAL app.current_user_id = :user_id"),
                {"user_id": user_id}
            )
            
            # Export all user tables
            data = {
                "user_context": await self.export_table(
                    db, "user_contexts", user_id
                ),
                "conversations": await self.export_table(
                    db, "conversations", user_id
                ),
                "products": await self.export_table(
                    db, "products", user_id
                ),
                "business_rules": await self.export_table(
                    db, "business_rules", user_id
                ),
                "export_timestamp": datetime.utcnow().isoformat()
            }
            
            return data
```

## 5. API Specifications

### 5.1 Internal APIs

#### Authentication Endpoints

**POST /api/auth/signup**
- **Description**: Create new user account
- **Authentication**: None required
- **Rate Limiting**: 5 requests per IP per hour

```yaml
Request:
  content-type: application/json
  body:
    email: string
    password: string (min 8 chars, 1 uppercase, 1 number)
    business_name: string (optional)

Response 201:
  user:
    id: uuid
    email: string
    created_at: datetime
  session:
    access_token: string (JWT)
    refresh_token: string
    expires_at: timestamp

Response 400:
  error: "Email already exists"
  code: "auth/email-exists"

Response 429:
  error: "Too many requests"
  retry_after: seconds
```

**POST /api/auth/refresh**
- **Description**: Refresh access token
- **Authentication**: Valid refresh token required

```yaml
Request:
  content-type: application/json
  body:
    refresh_token: string

Response 200:
  access_token: string
  expires_at: timestamp

Response 401:
  error: "Invalid refresh token"
  code: "auth/invalid-token"
```

#### Chat Service Endpoints

**WebSocket /ws/chat/{user_id}**
- **Description**: Real-time chat connection
- **Authentication**: Bearer token required
- **Rate Limiting**: 100 messages per minute

```yaml
# Connection
Headers:
  Authorization: Bearer {access_token}

# Message Types

## Client -> Server
{
  "type": "user_message",
  "content": string,
  "metadata": object (optional)
}

{
  "type": "update_context",
  "context_type": "business_rule|product_info|policy",
  "content": string
}

{
  "type": "typing_indicator",
  "is_typing": boolean
}

## Server -> Client
{
  "type": "ai_response",
  "data": {
    "content": string,
    "confidence": float,
    "extracted_rules": array,
    "suggestions": array
  }
}

{
  "type": "context_updated",
  "data": {
    "context_type": string,
    "summary": string
  }
}

{
  "type": "error",
  "data": {
    "code": string,
    "message": string
  }
}
```

**GET /api/chat/conversations**
- **Description**: List user conversations
- **Authentication**: Bearer token required

```yaml
Parameters:
  page: integer (default: 1)
  limit: integer (default: 20, max: 100)
  status: string (active|archived|all)
  platform: string (web|instagram|whatsapp)

Response 200:
  conversations: array of
    id: uuid
    title: string
    platform: string
    last_message: string
    last_message_at: datetime
    unread_count: integer
    status: string
  pagination:
    page: integer
    total_pages: integer
    total_items: integer
```

#### Inventory Service Endpoints

**GET /api/inventory/products**
- **Description**: List products with filtering
- **Authentication**: Bearer token required

```yaml
Parameters:
  page: integer
  limit: integer
  search: string
  category: string
  status: string (active|inactive|all)
  low_stock: boolean

Response 200:
  products: array of
    id: uuid
    name: string
    description: string
    category: string
    base_price: decimal
    total_stock: integer
    variant_count: integer
    status: string
    created_at: datetime
  pagination: object
```

**POST /api/inventory/products**
- **Description**: Create new product
- **Authentication**: Bearer token required

```yaml
Request:
  content-type: application/json
  body:
    name: string
    description: string
    category: string
    base_price: decimal
    variants: array of
      name: string
      sku: string
      price: decimal
      stock_quantity: integer
      attributes: object

Response 201:
  id: uuid
  name: string
  variants: array
  created_at: datetime
```

**PATCH /api/inventory/products/{product_id}**
- **Description**: Update product details
- **Authentication**: Bearer token required

```yaml
Request:
  content-type: application/json
  body:
    name: string (optional)
    description: string (optional)
    category: string (optional)
    status: string (optional)

Response 200:
  (updated product object)
```

**POST /api/inventory/stock/adjust**
- **Description**: Adjust stock levels
- **Authentication**: Bearer token required

```yaml
Request:
  content-type: application/json
  body:
    variant_id: uuid
    adjustment: integer
    reason: string

Response 200:
  variant_id: uuid
  previous_stock: integer
  new_stock: integer
  adjustment: integer
  timestamp: datetime
```

#### Social Media Service Endpoints

**GET /api/social/{platform}/auth**
- **Description**: Get OAuth URL for platform
- **Authentication**: Bearer token required

```yaml
Parameters:
  platform: string (instagram|whatsapp)

Response 200:
  auth_url: string
  state: string
```

**GET /api/social/{platform}/callback**
- **Description**: Handle OAuth callback
- **Authentication**: State parameter validation

```yaml
Parameters:
  code: string
  state: string

Response 302:
  Location: /dashboard/integrations?status=connected
```

**POST /api/social/webhooks/{platform}**
- **Description**: Receive platform webhooks
- **Authentication**: HMAC signature verification

```yaml
Headers:
  X-Hub-Signature-256: string
  X-Hub-Timestamp: string

Request:
  (Platform-specific webhook payload)

Response 200:
  status: "processed"
```

#### Notification Service Endpoints

**GET /api/notifications/stream**
- **Description**: Server-Sent Events stream
- **Authentication**: Bearer token required

```yaml
Headers:
  Accept: text/event-stream

Response:
  Content-Type: text/event-stream
  
  event: escalation
  data: {"id": "...", "type": "escalation", ...}
  
  event: low_stock
  data: {"id": "...", "type": "low_stock", ...}
```

**GET /api/notifications**
- **Description**: List notifications
- **Authentication**: Bearer token required

```yaml
Parameters:
  page: integer
  limit: integer
  unread_only: boolean
  type: string

Response 200:
  notifications: array
  unread_count: integer
  pagination: object
```

### 5.2 External Integrations

#### OpenAI Integration

```python
# OpenAI API integration service
from openai import AsyncOpenAI
from typing import List, Dict, Optional

class OpenAIService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=settings.OPENAI_API_KEY)
        self.model = "gpt-4-turbo-preview"
    
    async def generate_response(
        self,
        messages: List[Dict],
        functions: Optional[List[Dict]] = None,
        temperature: float = 0.7
    ) -> Dict:
        """Generate AI response with optional function calling"""
        
        try:
            completion = await self.client.chat.completions.create(
                model=self.model,
                messages=messages,
                functions=functions,
                function_call="auto" if functions else None,
                temperature=temperature,
                max_tokens=2000
            )
            
            response = completion.choices[0]
            
            # Handle function calls
            if response.message.function_call:
                function_result = await self.execute_function(
                    response.message.function_call
                )
                
                # Get final response after function execution
                messages.append(response.message)
                messages.append({
                    "role": "function",
                    "name": response.message.function_call.name,
                    "content": json.dumps(function_result)
                })
                
                final_completion = await self.client.chat.completions.create(
                    model=self.model,
                    messages=messages,
                    temperature=temperature
                )
                
                return {
                    "content": final_completion.choices[0].message.content,
                    "function_calls": [response.message.function_call],
                    "usage": final_completion.usage
                }
            
            return {
                "content": response.message.content,
                "function_calls": [],
                "usage": completion.usage
            }
            
        except Exception as e:
            # Fallback to Anthropic
            if "rate_limit" in str(e).lower():
                return await self.fallback_to_anthropic(messages)
            raise
    
    async def generate_embedding(self, text: str) -> List[float]:
        """Generate text embedding for vector search"""
        
        response = await self.client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        
        return response.data[0].embedding
```

#### Instagram Business API Integration

```python
# Instagram API service
class InstagramService:
    def __init__(self):
        self.base_url = "https://graph.instagram.com/v17.0"
        self.webhook_verify_token = settings.INSTAGRAM_WEBHOOK_VERIFY
    
    async def send_message(
        self,
        recipient_id: str,
        message: str,
        access_token: str
    ):
        """Send message via Instagram Direct"""
        
        async with AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/me/messages",
                headers={
                    "Authorization": f"Bearer {access_token}"
                },
                json={
                    "recipient": {"id": recipient_id},
                    "message": {"text": message}
                }
            )
            
            if response.status_code != 200:
                raise ExternalAPIError(
                    f"Instagram API error: {response.text}"
                )
            
            return response.json()
    
    async def get_user_profile(
        self,
        user_id: str,
        access_token: str
    ) -> Dict:
        """Get Instagram user profile"""
        
        async with AsyncClient() as client:
            response = await client.get(
                f"{self.base_url}/{user_id}",
                params={
                    "fields": "id,username,profile_picture_url",
                    "access_token": access_token
                }
            )
            
            return response.json()
    
    def verify_webhook(
        self,
        signature: str,
        payload: bytes
    ) -> bool:
        """Verify webhook signature"""
        
        expected_signature = hmac.new(
            self.webhook_verify_token.encode(),
            payload,
            hashlib.sha256
        ).hexdigest()
        
        return hmac.compare_digest(signature, expected_signature)
```

#### WhatsApp Business API Integration

```python
# WhatsApp API service
class WhatsAppService:
    def __init__(self):
        self.base_url = "https://graph.facebook.com/v17.0"
        self.phone_number_id = settings.WHATSAPP_PHONE_NUMBER_ID
    
    async def send_message(
        self,
        recipient_phone: str,
        message: str,
        access_token: str
    ):
        """Send WhatsApp message"""
        
        async with AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/{self.phone_number_id}/messages",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "application/json"
                },
                json={
                    "messaging_product": "whatsapp",
                    "to": recipient_phone,
                    "type": "text",
                    "text": {"body": message}
                }
            )
            
            return response.json()
    
    async def send_template_message(
        self,
        recipient_phone: str,
        template_name: str,
        parameters: List[str],
        access_token: str
    ):
        """Send WhatsApp template message"""
        
        components = [{
            "type": "body",
            "parameters": [
                {"type": "text", "text": param}
                for param in parameters
            ]
        }]
        
        async with AsyncClient() as client:
            response = await client.post(
                f"{self.base_url}/{self.phone_number_id}/messages",
                headers={
                    "Authorization": f"Bearer {access_token}"
                },
                json={
                    "messaging_product": "whatsapp",
                    "to": recipient_phone,
                    "type": "template",
                    "template": {
                        "name": template_name,
                        "language": {"code": "en"},
                        "components": components
                    }
                }
            )
            
            return response.json()
```

## 6. Security & Privacy

### 6.1 Authentication & Authorization

#### Authentication Mechanism and Flow

```python
# JWT token configuration
from jose import JWTError, jwt
from datetime import datetime, timedelta

class AuthService:
    def __init__(self):
        self.secret_key = settings.JWT_SECRET_KEY
        self.algorithm = "HS256"
        self.access_token_expire = timedelta(minutes=30)
        self.refresh_token_expire = timedelta(days=7)
    
    def create_access_token(
        self,
        user_id: str,
        additional_claims: dict = None
    ) -> str:
        """Create JWT access token"""
        
        claims = {
            "sub": user_id,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + self.access_token_expire,
            "type": "access"
        }
        
        if additional_claims:
            claims.update(additional_claims)
        
        return jwt.encode(claims, self.secret_key, algorithm=self.algorithm)
    
    def create_refresh_token(self, user_id: str) -> str:
        """Create JWT refresh token"""
        
        claims = {
            "sub": user_id,
            "iat": datetime.utcnow(),
            "exp": datetime.utcnow() + self.refresh_token_expire,
            "type": "refresh",
            "jti": str(uuid.uuid4())  # Unique token ID
        }
        
        return jwt.encode(claims, self.secret_key, algorithm=self.algorithm)
    
    async def verify_token(self, token: str) -> dict:
        """Verify and decode JWT token"""
        
        try:
            payload = jwt.decode(
                token,
                self.secret_key,
                algorithms=[self.algorithm]
            )
            
            # Check if token is blacklisted
            if await self.is_token_blacklisted(payload.get("jti")):
                raise JWTError("Token has been revoked")
            
            return payload
            
        except JWTError:
            raise HTTPException(
                status_code=401,
                detail="Invalid authentication credentials"
            )
```

#### Authorization Strategies and Role Definitions

```python
# Role-based access control
from enum import Enum
from typing import List

class UserRole(str, Enum):
    OWNER = "owner"
    ADMIN = "admin"
    OPERATOR = "operator"
    VIEWER = "viewer"

# Permission definitions
ROLE_PERMISSIONS = {
    UserRole.OWNER: [
        "users:*",
        "business:*",
        "inventory:*",
        "social:*",
        "settings:*"
    ],
    UserRole.ADMIN: [
        "users:read",
        "users:update",
        "business:*",
        "inventory:*",
        "social:*",
        "settings:read"
    ],
    UserRole.OPERATOR: [
        "business:read",
        "inventory:read",
        "inventory:update",
        "social:read",
        "social:respond"
    ],
    UserRole.VIEWER: [
        "business:read",
        "inventory:read",
        "social:read"
    ]
}

# Authorization decorator
def require_permission(permission: str):
    async def permission_checker(
        current_user: User = Depends(get_current_user)
    ):
        user_permissions = ROLE_PERMISSIONS.get(current_user.role, [])
        
        # Check exact permission or wildcard
        if permission in user_permissions:
            return True
        
        # Check wildcard permissions
        resource = permission.split(":")[0]
        if f"{resource}:*" in user_permissions:
            return True
        
        raise HTTPException(
            status_code=403,
            detail="Insufficient permissions"
        )
    
    return Depends(permission_checker)
```

#### Session Management

```python
# Session management with Redis
class SessionManager:
    def __init__(self, redis: Redis):
        self.redis = redis
        self.session_ttl = 3600  # 1 hour
    
    async def create_session(
        self,
        user_id: str,
        device_info: dict
    ) -> str:
        """Create new user session"""
        
        session_id = str(uuid.uuid4())
        session_data = {
            "user_id": user_id,
            "device": device_info,
            "created_at": datetime.utcnow().isoformat(),
            "last_activity": datetime.utcnow().isoformat()
        }
        
        # Store in Redis with TTL
        await self.redis.setex(
            f"session:{session_id}",
            self.session_ttl,
            json.dumps(session_data)
        )
        
        # Track user sessions
        await self.redis.sadd(
            f"user_sessions:{user_id}",
            session_id
        )
        
        return session_id
    
    async def validate_session(
        self,
        session_id: str
    ) -> Optional[dict]:
        """Validate and refresh session"""
        
        session_data = await self.redis.get(f"session:{session_id}")
        
        if not session_data:
            return None
        
        session = json.loads(session_data)
        
        # Update last activity
        session["last_activity"] = datetime.utcnow().isoformat()
        
        # Refresh TTL
        await self.redis.setex(
            f"session:{session_id}",
            self.session_ttl,
            json.dumps(session)
        )
        
        return session
    
    async def revoke_session(self, session_id: str):
        """Revoke specific session"""
        
        session_data = await self.redis.get(f"session:{session_id}")
        
        if session_data:
            session = json.loads(session_data)
            user_id = session["user_id"]
            
            # Remove from Redis
            await self.redis.delete(f"session:{session_id}")
            await self.redis.srem(f"user_sessions:{user_id}", session_id)
```

### 6.2 Data Security

#### Encryption Strategies

```python
# Encryption service for sensitive data
from cryptography.fernet import Fernet
from cryptography.hazmat.primitives import hashes
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

class EncryptionService:
    def __init__(self):
        self.master_key = settings.ENCRYPTION_MASTER_KEY
        self._fernet = None
    
    @property
    def fernet(self) -> Fernet:
        """Lazy load Fernet instance"""
        if not self._fernet:
            kdf = PBKDF2HMAC(
                algorithm=hashes.SHA256(),
                length=32,
                salt=b'stable_salt',  # Use proper salt in production
                iterations=100000,
            )
            key = base64.urlsafe_b64encode(
                kdf.derive(self.master_key.encode())
            )
            self._fernet = Fernet(key)
        
        return self._fernet
    
    def encrypt(self, data: str) -> str:
        """Encrypt sensitive data"""
        return self.fernet.encrypt(data.encode()).decode()
    
    def decrypt(self, encrypted_data: str) -> str:
        """Decrypt sensitive data"""
        return self.fernet.decrypt(encrypted_data.encode()).decode()
    
    def encrypt_field(self, value: Any) -> str:
        """Encrypt field for database storage"""
        if value is None:
            return None
        
        return self.encrypt(json.dumps(value))
    
    def decrypt_field(self, encrypted_value: str) -> Any:
        """Decrypt field from database"""
        if encrypted_value is None:
            return None
        
        return json.loads(self.decrypt(encrypted_value))
```

#### PII Handling and Protection

```python
# PII protection utilities
class PIIProtectionService:
    def __init__(self):
        self.encryption_service = EncryptionService()
        self.pii_fields = [
            'email', 'phone', 'address', 'ssn', 
            'credit_card', 'bank_account'
        ]
    
    def mask_pii(self, data: dict) -> dict:
        """Mask PII in data for logging"""
        masked_data = data.copy()
        
        for key, value in masked_data.items():
            if key in self.pii_fields and value:
                if '@' in str(value):  # Email
                    parts = value.split('@')
                    masked_data[key] = f"{parts[0][:2]}***@{parts[1]}"
                elif key == 'phone':
                    masked_data[key] = f"***-***-{str(value)[-4:]}"
                else:
                    masked_data[key] = "***REDACTED***"
            elif isinstance(value, dict):
                masked_data[key] = self.mask_pii(value)
        
        return masked_data
    
    async def anonymize_user_data(self, user_id: str):
        """Anonymize user data for GDPR compliance"""
        async with get_db() as db:
            # Update user context
            await db.execute(
                """
                UPDATE user_contexts 
                SET business_data = jsonb_set(
                    business_data,
                    '{anonymized}',
                    'true'
                ),
                updated_at = NOW()
                WHERE user_id = :user_id
                """,
                {"user_id": user_id}
            )
            
            # Anonymize messages
            await db.execute(
                """
                UPDATE messages 
                SET content = 'Message removed for privacy'
                WHERE user_id = :user_id
                """,
                {"user_id": user_id}
            )
            
            await db.commit()
```

#### Compliance Requirements

```python
# GDPR compliance service
class GDPRComplianceService:
    def __init__(self):
        self.retention_days = 30  # Default retention period
    
    async def export_user_data(self, user_id: str) -> dict:
        """Export all user data for GDPR data portability"""
        async with get_db() as db:
            # Set RLS context
            await db.execute(
                text("SET LOCAL app.current_user_id = :user_id"),
                {"user_id": user_id}
            )
            
            # Collect all user data
            user_data = {
                "export_date": datetime.utcnow().isoformat(),
                "user_id": user_id,
                "profile": await self._get_user_profile(db, user_id),
                "business_context": await self._get_business_context(db, user_id),
                "conversations": await self._get_conversations(db, user_id),
                "products": await self._get_products(db, user_id),
                "business_rules": await self._get_business_rules(db, user_id),
                "social_connections": await self._get_social_connections(db, user_id)
            }
            
            return user_data
    
    async def delete_user_data(self, user_id: str, reason: str):
        """Delete user data for GDPR right to erasure"""
        async with get_db() as db:
            try:
                # Log deletion request
                await self._log_deletion_request(db, user_id, reason)
                
                # Delete in correct order (handle foreign keys)
                tables = [
                    "rule_executions",
                    "business_rules",
                    "stock_movements",
                    "product_variants",
                    "products",
                    "social_messages",
                    "social_connections",
                    "messages",
                    "conversations",
                    "business_embeddings",
                    "notifications",
                    "events",
                    "user_contexts"
                ]
                
                for table in tables:
                    await db.execute(
                        text(f"DELETE FROM {table} WHERE user_id = :user_id"),
                        {"user_id": user_id}
                    )
                
                await db.commit()
                
                # Clean up cache and sessions
                await self._cleanup_user_cache(user_id)
                
            except Exception as e:
                await db.rollback()
                raise
    
    async def get_consent_status(self, user_id: str) -> dict:
        """Get user's consent status"""
        async with get_db() as db:
            result = await db.execute(
                """
                SELECT consent_data
                FROM user_contexts
                WHERE user_id = :user_id
                """,
                {"user_id": user_id}
            )
            
            row = result.first()
            return row.consent_data if row else {}
```

### 6.3 Application Security

#### Input Validation and Sanitization

```python
# Input validation schemas using Pydantic
from pydantic import BaseModel, validator, Field
import re

class MessageInput(BaseModel):
    content: str = Field(..., min_length=1, max_length=5000)
    metadata: Optional[dict] = None
    
    @validator('content')
    def sanitize_content(cls, v):
        # Remove any potential script tags
        v = re.sub(r'<script[^>]*>.*?</script>', '', v, flags=re.DOTALL)
        # Remove other dangerous HTML
        v = re.sub(r'<(?!/?(?:b|i|u|em|strong|code|pre)(?:\s|>))[^>]+>', '', v)
        return v.strip()

class ProductInput(BaseModel):
    name: str = Field(..., min_length=1, max_length=255)
    description: Optional[str] = Field(None, max_length=2000)
    price: Decimal = Field(..., gt=0, decimal_places=2)
    category: str = Field(..., regex=r'^[a-zA-Z0-9_-]+$')
    
    @validator('name', 'description')
    def sanitize_text(cls, v):
        if v:
            # Remove control characters
            v = ''.join(char for char in v if ord(char) >= 32)
            # Trim whitespace
            v = ' '.join(v.split())
        return v

# SQL injection prevention with parameterized queries
class SafeQueryBuilder:
    @staticmethod
    def build_search_query(
        table: str,
        search_term: str,
        fields: List[str]
    ) -> tuple:
        """Build safe search query"""
        # Validate table name against whitelist
        allowed_tables = ['products', 'conversations', 'messages']
        if table not in allowed_tables:
            raise ValueError(f"Invalid table name: {table}")
        
        # Validate field names
        allowed_fields = {
            'products': ['name', 'description', 'category'],
            'conversations': ['title', 'customer_name'],
            'messages': ['content']
        }
        
        if not all(f in allowed_fields[table] for f in fields):
            raise ValueError("Invalid field name")
        
        # Build query with parameterized search
        conditions = []
        params = {}
        
        for i, field in enumerate(fields):
            conditions.append(f"{field} ILIKE :search{i}")
            params[f'search{i}'] = f'%{search_term}%'
        
        query = f"""
            SELECT * FROM {table}
            WHERE {' OR '.join(conditions)}
            AND user_id = :user_id
        """
        
        return query, params
```

#### OWASP Compliance Measures

```python
# Security headers middleware
from fastapi import Request
from fastapi.responses import Response

class SecurityHeadersMiddleware:
    async def __call__(self, request: Request, call_next):
        response = await call_next(request)
        
        # Security headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' wss: https://api.openai.com https://api.anthropic.com"
        )
        
        return response

# CSRF protection
class CSRFProtection:
    def __init__(self):
        self.secret = settings.CSRF_SECRET
    
    def generate_token(self, session_id: str) -> str:
        """Generate CSRF token"""
        message = f"{session_id}:{int(time.time())}"
        signature = hmac.new(
            self.secret.encode(),
            message.encode(),
            hashlib.sha256
        ).hexdigest()
        
        return base64.b64encode(
            f"{message}:{signature}".encode()
        ).decode()
    
    def verify_token(
        self,
        token: str,
        session_id: str,
        max_age: int = 3600
    ) -> bool:
        """Verify CSRF token"""
        try:
            decoded = base64.b64decode(token).decode()
            message, signature = decoded.rsplit(':', 1)
            stored_session_id, timestamp = message.split(':')
            
            # Verify session ID
            if stored_session_id != session_id:
                return False
            
            # Verify age
            if int(time.time()) - int(timestamp) > max_age:
                return False
            
            # Verify signature
            expected_signature = hmac.new(
                self.secret.encode(),
                message.encode(),
                hashlib.sha256
            ).hexdigest()
            
            return hmac.compare_digest(signature, expected_signature)
            
        except Exception:
            return False
```

#### Security Audit Procedures

```python
# Security audit logging
class SecurityAuditLogger:
    def __init__(self):
        self.logger = logging.getLogger("security_audit")
    
    async def log_authentication(
        self,
        user_id: Optional[str],
        event_type: str,
        success: bool,
        ip_address: str,
        user_agent: str,
        metadata: dict = None
    ):
        """Log authentication events"""
        
        event = {
            "timestamp": datetime.utcnow().isoformat(),
            "event_type": event_type,
            "user_id": user_id,
            "success": success,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "metadata": metadata or {}
        }
        
        # Log to file
        self.logger.info(json.dumps(event))
        
        # Store in database for analysis
        async with get_db() as db:
            await db.execute(
                """
                INSERT INTO security_events 
                (event_type, user_id, success, ip_address, metadata)
                VALUES (:event_type, :user_id, :success, :ip_address, :metadata)
                """,
                {
                    "event_type": event_type,
                    "user_id": user_id,
                    "success": success,
                    "ip_address": ip_address,
                    "metadata": json.dumps(event)
                }
            )
            await db.commit()
    
    async def detect_anomalies(self, user_id: str) -> List[dict]:
        """Detect security anomalies"""
        
        async with get_db() as db:
            # Check for multiple failed login attempts
            failed_logins = await db.execute(
                """
                SELECT COUNT(*) as count
                FROM security_events
                WHERE user_id = :user_id
                AND event_type = 'login'
                AND success = false
                AND created_at > NOW() - INTERVAL '1 hour'
                """,
                {"user_id": user_id}
            )
            
            # Check for unusual IP addresses
            ip_changes = await db.execute(
                """
                SELECT DISTINCT ip_address
                FROM security_events
                WHERE user_id = :user_id
                AND created_at > NOW() - INTERVAL '24 hours'
                """,
                {"user_id": user_id}
            )
            
            anomalies = []
            
            if failed_logins.scalar() > 5:
                anomalies.append({
                    "type": "excessive_failed_logins",
                    "severity": "high",
                    "details": f"{failed_logins.scalar()} failed attempts"
                })
            
            ip_list = [row.ip_address for row in ip_changes]
            if len(ip_list) > 3:
                anomalies.append({
                    "type": "multiple_ip_addresses",
                    "severity": "medium",
                    "details": f"Accessed from {len(ip_list)} different IPs"
                })
            
            return anomalies
```

## 7. User Interface Specifications

### 7.1 Design System

The CHIDI interface follows a modern, clean design aesthetic emphasizing usability and accessibility. The design system prioritizes:

- **Visual Simplicity**: Clean layouts with strategic use of whitespace
- **Intuitive Navigation**: Clear information hierarchy and user flows
- **Responsive Design**: Seamless experience across devices
- **Accessibility**: WCAG 2.1 AA compliance throughout
- **Brand Personality**: Professional yet approachable tone

### 7.2 Design Foundations

#### 7.2.1 Color System

```scss
// Primary Colors
$primary-white: #FFFFFF;
$primary-deep-blue: #1A2332;

// Secondary Colors
$secondary-blue-light: #4A90A4;
$secondary-blue-pale: #E8F4F8;

// Accent Colors
$accent-teal: #00B4A6;
$accent-purple: #6366F1;

// Functional Colors
$success-green: #10B981;
$error-red: #EF4444;
$warning-orange: #F59E0B;
$neutral-gray: #6B7280;
$dark-gray: #1F2937;

// Background Colors
$bg-pure-white: #FFFFFF;
$bg-light: #F9FAFB;
$bg-dark: #111827;
$bg-card: #F8FAFC;

// Dark Mode Variants
$dark-bg-primary: #111827;
$dark-bg-card: #1F2937;
$dark-bg-elevated: #374151;
$dark-text-primary: #F9FAFB;
$dark-text-secondary: #D1D5DB;
$dark-border: #374151;
```

#### 7.2.2 Typography

```scss
// Font Stack
$font-primary: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
$font-mono: 'SF Mono', 'Monaco', 'Inconsolata', monospace;

// Type Scale
$type-scale: (
  'h1': (size: 32px, line-height: 40px, weight: 700, letter-spacing: -0.3px),
  'h2': (size: 28px, line-height: 36px, weight: 700, letter-spacing: -0.2px),
  'h3': (size: 24px, line-height: 32px, weight: 600, letter-spacing: -0.1px),
  'h4': (size: 20px, line-height: 28px, weight: 600, letter-spacing: 0),
  'body-lg': (size: 18px, line-height: 28px, weight: 400, letter-spacing: 0),
  'body': (size: 16px, line-height: 24px, weight: 400, letter-spacing: 0),
  'body-sm': (size: 14px, line-height: 20px, weight: 400, letter-spacing: 0.1px),
  'caption': (size: 12px, line-height: 16px, weight: 500, letter-spacing: 0.3px),
  'button': (size: 16px, line-height: 24px, weight: 500, letter-spacing: 0.2px)
);
```

#### 7.2.3 Spacing & Layout

```scss
// Base unit: 4px
$spacing: (
  'micro': 2px,
  'xs': 4px,
  'sm': 8px,
  'md': 12px,
  'base': 16px,
  'lg': 20px,
  'xl': 24px,
  'xxl': 32px,
  'xxxl': 48px
);

// Breakpoints
$breakpoints: (
  'mobile': 375px,
  'tablet': 768px,
  'desktop': 1024px,
  'wide': 1440px
);

// Container widths
$containers: (
  'sm': 640px,
  'md': 768px,
  'lg': 1024px,
  'xl': 1280px
);

// Grid system
$grid-columns: 12;
$grid-gutter: 24px;
```

#### 7.2.4 Interactive Elements

```scss
// Button styles
.button {
  // Base styles
  height: 48px;
  padding: 12px 20px;
  border-radius: 8px;
  font-weight: 500;
  transition: all 150ms ease-out;
  
  // Primary variant
  &--primary {
    background-color: $primary-deep-blue;
    color: $primary-white;
    
    &:hover {
      background-color: darken($primary-deep-blue, 10%);
      transform: translateY(-1px);
      box-shadow: 0 4px 12px rgba($primary-deep-blue, 0.2);
    }
  }
  
  // Secondary variant
  &--secondary {
    background-color: transparent;
    color: $primary-deep-blue;
    border: 2px solid $primary-deep-blue;
    
    &:hover {
      background-color: $secondary-blue-pale;
    }
  }
  
  // States
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  &:focus-visible {
    outline: 2px solid $accent-purple;
    outline-offset: 2px;
  }
}

// Input fields
.input {
  height: 56px;
  padding: 16px;
  border: 1.5px solid $neutral-gray;
  border-radius: 8px;
  background-color: $primary-white;
  color: $dark-gray;
  transition: all 200ms ease;
  
  &:focus {
    border-color: $accent-purple;
    border-width: 2px;
    outline: none;
  }
  
  &::placeholder {
    color: $neutral-gray;
  }
}
```

#### 7.2.5 Component Specifications

```typescript
// Design tokens
export const tokens = {
  colors: {
    primary: {
      white: '#FFFFFF',
      deepBlue: '#1A2332',
    },
    secondary: {
      blueLight: '#4A90A4',
      bluePale: '#E8F4F8',
    },
    accent: {
      teal: '#00B4A6',
      purple: '#6366F1',
    },
    semantic: {
      success: '#10B981',
      error: '#EF4444',
      warning: '#F59E0B',
      info: '#3B82F6',
    },
  },
  
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 4px 12px 0 rgba(0, 0, 0, 0.06)',
    md: '0 8px 24px 0 rgba(0, 0, 0, 0.08)',
    lg: '0 16px 32px 0 rgba(0, 0, 0, 0.10)',
  },
  
  animations: {
    micro: '150ms ease-out',
    fast: '250ms ease-in-out',
    normal: '300ms cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    slow: '400ms cubic-bezier(0.2, 0.8, 0.2, 1)',
  },
};
```

### 7.3 User Experience Flows

#### Authentication Flow
```mermaid
graph TD
    A[Landing Page] --> B{User Action}
    B -->|Sign Up| C[Registration Form]
    B -->|Sign In| D[Login Form]
    C --> E[Email Verification]
    E --> F[Onboarding Chat]
    D --> G{Has Onboarded?}
    G -->|Yes| H[Dashboard]
    G -->|No| F
    F --> I[Business Setup]
    I --> H
```

#### Conversation Management Flow
```mermaid
graph TD
    A[Dashboard] --> B[Active Conversations]
    B --> C{Select Conversation}
    C --> D[Conversation View]
    D --> E{AI Confidence}
    E -->|High| F[Auto-Response]
    E -->|Low| G[Human Review]
    G --> H[Edit Response]
    H --> I[Send Response]
    F --> J[Log Interaction]
    I --> J
```

#### Inventory Management Flow
```mermaid
graph TD
    A[Inventory Dashboard] --> B{Action}
    B -->|Add Product| C[Product Form]
    B -->|Import| D[CSV Upload]
    B -->|View| E[Product List]
    C --> F[Variant Builder]
    F --> G[Save Product]
    D --> H[Field Mapping]
    H --> I[Import Preview]
    I --> J[Confirm Import]
    E --> K[Product Details]
    K --> L[Edit Product]
```

## 8. Infrastructure & Deployment

### 8.1 Infrastructure Requirements

#### Hosting Environment Specifications

**Production Environment**
- Platform: Render.com (Microservices deployment)
- Region: US-East (Primary), US-West (Failover)
- Service Instances:
  - API Gateway: 2 instances (auto-scaling 2-10)
  - Chat Service: 3 instances (WebSocket support)
  - Inventory Service: 2 instances
  - Social Media Service: 2 instances
  - Notification Service: 2 instances
  - Background Workers: 3 instances

**Development Environment**
- Local: Docker Compose setup
- Staging: Render preview environments
- Testing: GitHub Actions runners

#### Server Requirements and Configuration

```yaml
# docker-compose.yml for local development
version: '3.8'

services:
  postgres:
    image: postgres:15-alpine
    environment:
      POSTGRES_DB: chidi_dev
      POSTGRES_USER: chidi_user
      POSTGRES_PASSWORD: ${DB_PASSWORD}
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./init.sql:/docker-entrypoint-initdb.d/init.sql
    ports:
      - "5432:5432"

  redis:
    image: redis:7-alpine
    command: redis-server --appendonly yes
    volumes:
      - redis_data:/data
    ports:
      - "6379:6379"

  api-gateway:
    build:
      context: ./services/api-gateway
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://chidi_user:${DB_PASSWORD}@postgres:5432/chidi_dev
      - REDIS_URL=redis://redis:6379
      - JWT_SECRET=${JWT_SECRET}
    ports:
      - "8000:8000"
    depends_on:
      - postgres
      - redis

  chat-service:
    build:
      context: ./services/chat
      dockerfile: Dockerfile
    environment:
      - DATABASE_URL=postgresql://chidi_user:${DB_PASSWORD}@postgres:5432/chidi_dev
      - REDIS_URL=redis://redis:6379
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    ports:
      - "8001:8001"
    depends_on:
      - postgres
      - redis

  # Additional services...

volumes:
  postgres_data:
  redis_data:
```

```dockerfile
# Base Dockerfile for Python services
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y \
    gcc \
    postgresql-client \
    && rm -rf /var/lib/apt/lists/*

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application code
COPY . .

# Run migrations and start server
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 8000"]
```

#### Network Architecture

```yaml
# Render.yaml service configuration
services:
  # API Gateway (Public)
  - type: web
    name: chidi-api-gateway
    env: python
    plan: standard
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    envVars:
      - key: DATABASE_URL
        fromDatabase:
          name: chidi-db
          property: connectionString
      - key: REDIS_URL
        fromService:
          name: chidi-redis
          property: connectionString
    autoDeploy: true

  # Chat Service (Private)
  - type: pserv
    name: chidi-chat-service
    env: python
    plan: standard
    buildCommand: pip install -r requirements.txt
    startCommand: uvicorn main:app --host 0.0.0.0 --port $PORT
    
  # Background Workers
  - type: worker
    name: chidi-celery-worker
    env: python
    plan: standard
    buildCommand: pip install -r requirements.txt
    startCommand: celery -A tasks worker --loglevel=info

databases:
  - name: chidi-db
    plan: standard
    databaseName: chidi_production
    user: chidi_user

# Redis instance
  - name: chidi-redis
    type: redis
    plan: standard
```

#### Storage Requirements

**Database Storage**
- PostgreSQL: 100GB initial, auto-scaling
- pgvector indexes: 10GB reserved
- Backup retention: 30 days
- Point-in-time recovery: 7 days

**File Storage (Supabase Storage)**
- User uploads: 1TB pooled storage
- CDN distribution for media files
- Automatic image optimization
- Backup exports: 100GB

**Redis Storage**
- Memory: 4GB per instance
- Persistence: AOF with 1-second fsync
- Eviction policy: allkeys-lru

### 8.2 Deployment Strategy

#### CI/CD Pipeline Configuration

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches:
      - main
  pull_request:
    branches:
      - main

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: testpass
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 5432:5432
      
      redis:
        image: redis:7
        options: >-
          --health-cmd "redis-cli ping"
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5
        ports:
          - 6379:6379

    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Cache dependencies
        uses: actions/cache@v3
        with:
          path: ~/.cache/pip
          key: ${{ runner.os }}-pip-${{ hashFiles('**/requirements.txt') }}
      
      - name: Install dependencies
        run: |
          python -m pip install --upgrade pip
          pip install -r requirements.txt
          pip install -r requirements-dev.txt
      
      - name: Run tests
        env:
          DATABASE_URL: postgresql://postgres:testpass@localhost:5432/test_db
          REDIS_URL: redis://localhost:6379
        run: |
          pytest tests/ --cov=app --cov-report=xml
      
      - name: Upload coverage
        uses: codecov/codecov-action@v3

  deploy:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - uses: actions/checkout@v3
      
      - name: Deploy API Gateway
        uses: render-oss/deploy-action@v1
        with:
          service-id: ${{ secrets.RENDER_API_GATEWAY_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
      
      - name: Deploy Chat Service
        uses: render-oss/deploy-action@v1
        with:
          service-id: ${{ secrets.RENDER_CHAT_SERVICE_ID }}
          api-key: ${{ secrets.RENDER_API_KEY }}
      
      - name: Run migrations
        env:
          DATABASE_URL: ${{ secrets.PRODUCTION_DATABASE_URL }}
        run: |
          alembic upgrade head
      
      - name: Notify deployment
        uses: 8398a7/action-slack@v3
        with:
          status: ${{ job.status }}
          text: 'Production deployment completed'
        env:
          SLACK_WEBHOOK_URL: ${{ secrets.SLACK_WEBHOOK }}
```

#### Environment Management

```python
# config.py - Environment configuration
from pydantic import BaseSettings, Field
from typing import Optional
import os

class Settings(BaseSettings):
    # Environment
    environment: str = Field(default="development")
    debug: bool = Field(default=False)
    
    # Database
    database_url: str
    database_pool_size: int = Field(default=20)
    database_max_overflow: int = Field(default=0)
    
    # Redis
    redis_url: str
    redis_max_connections: int = Field(default=50)
    
    # Authentication
    jwt_secret_key: str
    jwt_algorithm: str = Field(default="HS256")
    access_token_expire_minutes: int = Field(default=30)
    
    # External APIs
    openai_api_key: str
    anthropic_api_key: Optional[str] = None
    instagram_app_id: str
    instagram_app_secret: str
    whatsapp_api_key: str
    
    # Security
    encryption_key: str
    csrf_secret: str
    allowed_origins: list = Field(default=["http://localhost:3000"])
    
    # Rate Limiting
    rate_limit_per_minute: int = Field(default=60)
    rate_limit_per_hour: int = Field(default=1000)
    
    # Feature Flags
    enable_anthropic_fallback: bool = Field(default=True)
    enable_debug_logging: bool = Field(default=False)
    
    class Config:
        env_file = f".env.{os.getenv('ENVIRONMENT', 'development')}"
        case_sensitive = False

# Environment-specific configurations
def get_settings() -> Settings:
    env = os.getenv("ENVIRONMENT", "development")
    
    if env == "production":
        return Settings(
            environment="production",
            debug=False,
            allowed_origins=[
                "https://chidi.app",
                "https://www.chidi.app"
            ],
            database_pool_size=50,
            redis_max_connections=100
        )
    elif env == "staging":
        return Settings(
            environment="staging",
            debug=True,
            allowed_origins=["https://staging.chidi.app"],
            database_pool_size=20
        )
    else:
        return Settings(
            environment="development",
            debug=True,
            allowed_origins=["http://localhost:3000"],
            database_pool_size=5
        )

settings = get_settings()
```

#### Deployment Procedures and Rollback Strategies

```python
# deployment/deploy.py - Deployment automation script
import asyncio
import subprocess
from datetime import datetime
from typing import List, Dict

class DeploymentManager:
    def __init__(self, environment: str):
        self.environment = environment
        self.services = [
            "api-gateway",
            "chat-service",
            "inventory-service",
            "social-service",
            "notification-service"
        ]
        self.deployment_id = f"deploy-{datetime.utcnow().strftime('%Y%m%d-%H%M%S')}"
    
    async def pre_deployment_checks(self) -> bool:
        """Run pre-deployment health checks"""
        checks = [
            self.check_database_migrations(),
            self.check_redis_connection(),
            self.check_external_apis(),
            self.run_integration_tests()
        ]
        
        results = await asyncio.gather(*checks)
        return all(results)
    
    async def deploy_service(self, service: str) -> Dict:
        """Deploy individual service with canary strategy"""
        
        # Tag current version for rollback
        await self.tag_current_version(service)
        
        # Deploy new version to canary instance (10% traffic)
        canary_result = await self.deploy_canary(service)
        
        if not canary_result["success"]:
            return {
                "service": service,
                "status": "failed",
                "error": canary_result["error"]
            }
        
        # Monitor canary for 5 minutes
        monitoring_result = await self.monitor_canary(service, duration=300)
        
        if monitoring_result["healthy"]:
            # Full deployment
            await self.deploy_full(service)
            return {
                "service": service,
                "status": "success",
                "deployment_id": self.deployment_id
            }
        else:
            # Rollback canary
            await self.rollback_canary(service)
            return {
                "service": service,
                "status": "rolled_back",
                "reason": monitoring_result["issues"]
            }
    
    async def deploy_canary(self, service: str) -> Dict:
        """Deploy to canary instance"""
        
        cmd = [
            "render", "deploy",
            "--service", f"{service}-canary",
            "--image", f"chidi/{service}:{self.deployment_id}",
            "--wait"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        return {
            "success": result.returncode == 0,
            "output": result.stdout,
            "error": result.stderr
        }
    
    async def monitor_canary(self, service: str, duration: int) -> Dict:
        """Monitor canary deployment health"""
        
        metrics = {
            "error_rate": [],
            "response_time": [],
            "cpu_usage": [],
            "memory_usage": []
        }
        
        end_time = asyncio.get_event_loop().time() + duration
        
        while asyncio.get_event_loop().time() < end_time:
            # Collect metrics
            current_metrics = await self.collect_metrics(f"{service}-canary")
            
            for key, value in current_metrics.items():
                metrics[key].append(value)
            
            # Check thresholds
            if current_metrics["error_rate"] > 0.05:  # 5% error rate
                return {
                    "healthy": False,
                    "issues": "High error rate detected"
                }
            
            if current_metrics["response_time"] > 1000:  # 1 second
                return {
                    "healthy": False,
                    "issues": "High response time detected"
                }
            
            await asyncio.sleep(30)  # Check every 30 seconds
        
        return {"healthy": True}
    
    async def rollback(self, service: str, version: str):
        """Rollback to specific version"""
        
        # Stop current deployment
        await self.stop_service(service)
        
        # Deploy previous version
        cmd = [
            "render", "deploy",
            "--service", service,
            "--image", f"chidi/{service}:{version}",
            "--wait"
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            # Verify rollback
            health = await self.check_service_health(service)
            
            if health["healthy"]:
                await self.notify_rollback_success(service, version)
            else:
                await self.notify_rollback_failure(service, version)
        
        return result.returncode == 0
```

```yaml
# deployment/rollback-plan.yml
rollback_procedures:
  triggers:
    - error_rate_threshold: 5%
    - response_time_threshold: 2000ms
    - health_check_failures: 3
    - memory_usage_threshold: 90%
  
  automatic_rollback:
    enabled: true
    verification_period: 300  # 5 minutes
    
  steps:
    - name: "Detect Issue"
      actions:
        - monitor_metrics
        - check_alerts
        - verify_thresholds
    
    - name: "Initiate Rollback"
      actions:
        - notify_team
        - tag_problematic_version
        - stop_traffic_to_new_version
    
    - name: "Execute Rollback"
      actions:
        - deploy_previous_version
        - verify_deployment
        - restore_traffic
    
    - name: "Post-Rollback"
      actions:
        - verify_system_health
        - create_incident_report
        - schedule_retrospective

  manual_rollback_commands:
    single_service: |
      ./deploy.py rollback --service {service_name} --version {version}
    
    full_rollback: |
      ./deploy.py rollback --all --version {version}
    
    database_rollback: |
      alembic downgrade -1
```

#### Configuration Management

```python
# config_manager.py - Configuration management
import os
from typing import Dict, Any
import json
from cryptography.fernet import Fernet

class ConfigManager:
    def __init__(self, environment: str):
        self.environment = environment
        self.config_store = self._init_config_store()
        self.cipher = Fernet(os.getenv("CONFIG_ENCRYPTION_KEY"))
    
    def _init_config_store(self) -> Dict:
        """Initialize configuration store"""
        
        # Base configuration
        base_config = {
            "app": {
                "name": "CHIDI",
                "version": self._get_app_version(),
                "environment": self.environment
            },
            "features": {
                "chat_enabled": True,
                "social_integration_enabled": True,
                "inventory_enabled": True,
                "ai_fallback_enabled": True
            },
            "limits": {
                "max_conversation_length": 100,
                "max_product_count": 10000,
                "max_file_upload_size": 10485760,  # 10MB
                "rate_limit_per_minute": 60
            }
        }
        
        # Environment-specific overrides
        env_config = self._load_env_config()
        
        return self._deep_merge(base_config, env_config)
    
    def get(self, key: str, default: Any = None) -> Any:
        """Get configuration value"""
        
        keys = key.split(".")
        value = self.config_store
        
        for k in keys:
            if isinstance(value, dict) and k in value:
                value = value[k]
            else:
                return default
        
        return value
    
    def get_secret(self, key: str) -> str:
        """Get encrypted secret"""
        
        encrypted_value = os.getenv(f"SECRET_{key.upper()}")
        
        if encrypted_value:
            return self.cipher.decrypt(encrypted_value.encode()).decode()
        
        raise ValueError(f"Secret {key} not found")
    
    def update_feature_flag(self, flag: str, enabled: bool):
        """Update feature flag in runtime"""
        
        if flag in self.config_store["features"]:
            self.config_store["features"][flag] = enabled
            
            # Persist to Redis for distributed updates
            self._sync_to_redis(f"feature:{flag}", enabled)
            
            # Notify services
            self._broadcast_config_update({
                "type": "feature_flag",
                "flag": flag,
                "enabled": enabled
            })
```

```yaml
# environments/production.yml
production:
  api:
    base_url: https://api.chidi.app
    timeout: 30
    max_retries: 3
  
  database:
    host: ${DATABASE_HOST}
    port: 5432
    name: chidi_production
    ssl_mode: require
    pool_size: 50
    max_overflow: 10
  
  redis:
    cluster_endpoints:
      - ${REDIS_NODE_1}
      - ${REDIS_NODE_2}
      - ${REDIS_NODE_3}
    password: ${REDIS_PASSWORD}
    ssl: true
  
  monitoring:
    sentry_dsn: ${SENTRY_DSN}
    datadog_api_key: ${DATADOG_API_KEY}
    log_level: INFO
  
  security:
    allowed_origins:
      - https://chidi.app
      - https://www.chidi.app
    csrf_enabled: true
    rate_limiting_enabled: true
    
  features:
    maintenance_mode: false
    new_user_registrations: true
    ai_confidence_threshold: 0.8
```

## Project Structure

The CHIDI application follows a microservices architecture with feature-based organization within each service:

### Backend Structure (FastAPI Microservices)

```
chidi-backend/
├── services/
│   ├── api-gateway/
│   │   ├── app/
│   │   │   ├── main.py              # FastAPI app initialization
│   │   │   ├── middleware/          # Auth, CORS, rate limiting
│   │   │   ├── routers/             # Route aggregation
│   │   │   └── dependencies.py      # Shared dependencies
│   │   ├── Dockerfile
│   │   └── pyproject.toml
│   │
│   ├── chat/
│   │   ├── app/
│   │   │   ├── main.py
│   │   │   ├── features/
│   │   │   │   ├── conversations/   # Conversation management
│   │   │   │   │   ├── models.py
│   │   │   │   │   ├── schemas.py
│   │   │   │   │   ├── service.py
│   │   │   │   │   ├── repository.py
│   │   │   │   │   └── router.py
│   │   │   │   ├── context/         # Context management
│   │   │   │   │   ├── manager.py
│   │   │   │   │   ├── embeddings.py
│   │   │   │   │   └── sliding_window.py
│   │   │   │   └── rules/           # Business rules
│   │   │   │       ├── extractor.py
│   │   │   │       ├── executor.py
│   │   │   │       └── models.py
│   │   │   ├── websocket/
│   │   │   │   ├── manager.py
│   │   │   │   └── handlers.py
│   │   │   └── integrations/
│   │   │       ├── openai.py
│   │   │       └── anthropic.py
│   │   ├── Dockerfile
│   │   └── pyproject.toml
│   │
│   ├── inventory/
│   │   ├── app/
│   │   │   ├── features/
│   │   │   │   ├── products/
│   │   │   │   │   ├── models.py
│   │   │   │   │   ├── schemas.py
│   │   │   │   │   ├── service.py
│   │   │   │   │   └── router.py
│   │   │   │   ├── variants/
│   │   │   │   │   └── ...
│   │   │   │   └── import_export/
│   │   │   │       ├── csv_handler.py
│   │   │   │       └── validators.py
│   │   │   └── shared/
│   │   │       └── notifications.py
│   │   └── ...
│   │
│   ├── social/
│   │   ├── app/
│   │   │   ├── features/
│   │   │   │   ├── instagram/
│   │   │   │   │   ├── oauth.py
│   │   │   │   │   ├── webhooks.py
│   │   │   │   │   └── api_client.py
│   │   │   │   ├── whatsapp/
│   │   │   │   │   └── ...
│   │   │   │   └── message_processing/
│   │   │   │       ├── confidence_scorer.py
│   │   │   │       └── response_handler.py
│   │   │   └── security/
│   │   │       └── webhook_verification.py
│   │   └── ...
│   │
│   └── notifications/
│       ├── app/
│       │   ├── features/
│       │   │   ├── escalations/
│       │   │   ├── alerts/
│       │   │   └── sse/
│       │   │       ├── handler.py
│       │   │       └── event_stream.py
│       │   └── shared/
│       │       └── event_bus.py
│       └── ...
│
├── shared/
│   ├── database/
│   │   ├── models/                  # SQLAlchemy models
│   │   ├── migrations/              # Alembic migrations
│   │   └── connection.py
│   ├── cache/
│   │   └── redis_client.py
│   ├── auth/
│   │   ├── jwt_handler.py
│   │   └── permissions.py
│   └── utils/
│       ├── encryption.py
│       └── validators.py
│
├── workers/
│   ├── celery_app.py
│   ├── tasks/
│   │   ├── message_processing.py
│   │   ├── token_refresh.py
│   │   └── data_sync.py
│   └── schedulers/
│       └── periodic_tasks.py
│
├── tests/
│   ├── unit/
│   ├── integration/
│   └── e2e/
│
├── deployment/
│   ├── docker/
│   ├── kubernetes/
│   └── scripts/
│
├── docker-compose.yml
├── .env.example
└── README.md
```

### Frontend Structure (Next.js)

```
chidi-frontend/
├── app/                            # Next.js 14 App Router
│   ├── (auth)/
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── layout.tsx
│   │
│   ├── (dashboard)/
│   │   ├── layout.tsx              # Dashboard layout with sidebar
│   │   ├── page.tsx                # Dashboard home
│   │   ├── chat/
│   │   │   └── page.tsx
│   │   ├── inventory/
│   │   │   ├── page.tsx
│   │   │   └── [productId]/
│   │   │       └── page.tsx
│   │   ├── integrations/
│   │   │   └── page.tsx
│   │   └── settings/
│   │       └── page.tsx
│   │
│   ├── api/                        # API routes (if needed)
│   │   └── webhooks/
│   │       └── route.ts
│   │
│   ├── layout.tsx                  # Root layout
│   ├── page.tsx                    # Landing page
│   └── global-error.tsx
│
├── features/                       # Feature-based organization
│   ├── auth/
│   │   ├── components/
│   │   │   ├── LoginForm.tsx
│   │   │   └── SignupForm.tsx
│   │   ├── hooks/
│   │   │   └── useAuth.ts
│   │   └── services/
│   │       └── auth.service.ts
│   │
│   ├── chat/
│   │   ├── components/
│   │   │   ├── ChatInterface.tsx
│   │   │   ├── MessageBubble.tsx
│   │   │   └── TypingIndicator.tsx
│   │   ├── hooks/
│   │   │   ├── useWebSocket.ts
│   │   │   └── useMessages.ts
│   │   └── services/
│   │       └── chat.service.ts
│   │
│   ├── inventory/
│   │   ├── components/
│   │   │   ├── ProductForm.tsx
│   │   │   ├── ProductList.tsx
│   │   │   └── VariantBuilder.tsx
│   │   ├── hooks/
│   │   │   └── useProducts.ts
│   │   └── services/
│   │       └── inventory.service.ts
│   │
│   └── notifications/
│       ├── components/
│       │   └── NotificationCenter.tsx
│       ├── hooks/
│       │   └── useNotifications.ts
│       └── services/
│           └── sse.service.ts
│
├── shared/
│   ├── components/
│   │   ├── ui/                     # Shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── ...
│   │   ├── layouts/
│   │   │   ├── DashboardLayout.tsx
│   │   │   └── AuthLayout.tsx
│   │   └── common/
│   │       ├── LoadingSpinner.tsx
│   │       └── ErrorBoundary.tsx
│   │
│   ├── hooks/
│   │   ├── useApi.ts
│   │   └── useLocalStorage.ts
│   │
│   ├── lib/
│   │   ├── api-client.ts
│   │   ├── websocket-client.ts
│   │   └── utils.ts
│   │
│   ├── store/                      # Zustand stores
│   │   ├── auth.store.ts
│   │   └── app.store.ts
│   │
│   └── types/
│       ├── api.types.ts
│       └── models.types.ts
│
├── public/
│   ├── icons/
│   └── images/
│
├── styles/
│   ├── globals.css
│   └── tokens.css                  # Design tokens
│
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### Key Design Decisions

1. **Feature-Based Organization**: Each service organizes code by feature rather than technical layers, making it easier to understand and modify specific functionality.

2. **Shared Libraries**: Common functionality is extracted to shared modules that can be imported by any service.

3. **Clear Separation of Concerns**: 
   - Models: Database schema definitions
   - Schemas: Pydantic models for validation
   - Services: Business logic
   - Repositories: Data access layer
   - Routers: HTTP endpoints

4. **Consistent Naming**: 
   - Files: `snake_case.py` for Python, `PascalCase.tsx` for React components
   - Directories: `lowercase` or `kebab-case`
   - Classes/Components: `PascalCase`
   - Functions/Variables: `camelCase` in TypeScript, `snake_case` in Python

5. **Testing Structure**: Mirrors the source code structure for easy navigation and ensures all features have corresponding tests.
            