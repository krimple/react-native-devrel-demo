# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React Native OpenTelemetry demonstration application showcasing observability features in mobile apps. The app simulates an astronomy equipment e-commerce shop with comprehensive telemetry instrumentation, designed to parallel the Android version.

## Common Development Commands

### Build and Run
```bash
# Install dependencies
npm install

# Start Metro bundler
npm start

# Run on iOS simulator
npm run ios

# Run on Android emulator
npm run android

# Run tests
npm test

# TypeScript check
npx tsc --noEmit
```

### Infrastructure Setup
```bash
# Start OpenTelemetry collector and Jaeger
docker compose build
docker compose up

# View telemetry data
# Jaeger UI: http://localhost:16686
# Collector logs: docker compose logs collector
```

### Required Configuration

Create `.env` file with your Honeycomb API key:
```
HONEYCOMB_API_KEY=your_honeycomb_api_key
```

## Architecture Overview

### OpenTelemetry Integration
- **Application Entry**: `App.tsx` initializes OpenTelemetry and Honeycomb SDK
- **Service Name**: "react-native-otel-demo"
- **Dual Backends**: Local Jaeger + Honeycomb.io
- **Instrumentation Types**: Manual spans/events (React Native has limited auto-instrumentation)
- **Navigation Tracking**: React Navigation integration for screen transitions

### Key Components (Planned)
- **Main Flow**: `App.tsx` → `AstronomyShopScreen.tsx` (shopping flow)
- **Product Data**: Same `/api/products` endpoint as Android version
- **Navigation**: React Navigation with screen transition telemetry
- **State Management**: Context API or Redux Toolkit with async actions:
  - `ProductContext` - Product listing with lifecycle-aware loading and currency support
  - `CartContext` - Shopping cart operations
  - `CurrencyContext` - Currency selection and management
- **API Services**: REST clients with comprehensive telemetry:
  - `ProductService.ts` - Product catalog with currency parameter support
  - `CurrencyService.ts` - Available currencies fetching
  - `ShippingService.ts` - Shipping cost calculation
  - `CheckoutService.ts` - Order placement

### Demo Test Scenarios
- **Manual Error**: Trigger error boundaries with specific product interactions
- **Performance**: Track rendering performance and navigation timing
- **Manual Instrumentation**: Custom spans for user interactions

### Build System
- **Metro**: React Native bundler
- **TypeScript**: Full type safety
- **Platform**: iOS and Android support

### Key Dependencies (Planned)
- `@opentelemetry/api` - Core OpenTelemetry API
- `@opentelemetry/auto-instrumentations-node` - Auto-instrumentation (where available)
- `@opentelemetry/exporter-jaeger` - Jaeger exporter
- `@opentelemetry/sdk-node` - OpenTelemetry SDK
- `@react-navigation/native` - Navigation with telemetry integration
- `react-native-vector-icons` - Icon library
- `react-native-dotenv` - Environment variable management

## Telemetry Patterns

### Manual Instrumentation Examples
- Custom spans for user interactions
- Navigation events with screen transition timing
- API call instrumentation with request/response details
- User gesture tracking (taps, swipes, form submissions)
- Error boundary integration for crash reporting

### Currency and Shipping Features

#### Multi-Currency Support
- **Available Currencies**: 33+ currencies fetched from `/api/currency` endpoint
- **Currency Storage**: AsyncStorage for persistent selection with "USD" default
- **Dynamic Pricing**: All product APIs support `?currencyCode=` parameter
- **Currency UI Components**:
  - Currency picker modal with search functionality
  - Price display with proper currency formatting
  - Real-time price updates across all screens

#### Shipping Cost Calculation
- **Preview Method**: Uses checkout API with preview flag
- **Real-time Calculation**: Triggered when shipping info complete
- **Currency-Aware**: Shipping costs in selected currency
- **Error Handling**: Graceful degradation when API unavailable

#### Client-Side Cart Architecture
- **Mobile Optimization**: Cart state maintained locally
- **Immediate Updates**: Cart operations trigger immediate UI updates
- **Checkout Integration**: Cart contents passed to checkout API

### API Endpoints
The React Native app integrates with the same REST API as the Android version:
- **GET /api/currency** - Fetch available currencies
- **GET /api/products?currencyCode={code}** - Product catalog with pricing
- **GET /api/products/{id}?currencyCode={code}** - Individual product details
- **POST /api/checkout?currencyCode={code}** - Place order
- **GET /images/products/{picture}** - Product images

**Base URL Configuration**:
- Local Development: `http://localhost:9191` (React Native can access localhost directly)
- Production: `https://www.zurelia.honeydemo.io`

### Collector Configuration
- **Receivers**: OTLP gRPC (4317) and HTTP (4318)
- **Exporters**: Debug console + Honeycomb
- **Data Types**: Traces, logs, metrics, events

## React Native Specific Considerations

### Platform Differences
- **iOS**: Uses native iOS OpenTelemetry libraries where available
- **Android**: May leverage existing Android OTel integration
- **JavaScript Bridge**: Telemetry data crosses JS/Native boundary

### Performance Monitoring
- **React Navigation**: Built-in navigation timing
- **Component Rendering**: Custom hooks for render performance
- **Memory Usage**: Track component mount/unmount cycles
- **Network Requests**: Fetch API instrumentation

### Error Handling
- **Error Boundaries**: React error boundary integration
- **Unhandled Rejections**: Global promise rejection handling
- **Native Crashes**: Bridge to native crash reporting (where possible)

## Development Guidelines

### Code Organization
- **Services**: API clients in `src/services/`
- **Components**: Reusable UI components in `src/components/`
- **Screens**: Navigation screens in `src/screens/`
- **Context**: Global state in `src/context/`
- **Utils**: Utility functions in `src/utils/`
- **Types**: TypeScript definitions in `src/types/`

### Telemetry Best Practices
- **Span Naming**: Use consistent naming conventions
- **Attribute Standards**: Follow OpenTelemetry semantic conventions
- **Context Propagation**: Ensure proper parent-child span relationships
- **Error Handling**: Capture and report errors with context

### Testing Strategy
- **Unit Tests**: Component and service testing with Jest
- **Integration Tests**: API integration with mock backends
- **E2E Tests**: Detox for end-to-end testing (optional)
- **Telemetry Tests**: Verify span creation and attributes

## Implementation Status

This project is currently in planning phase. The React Native project structure has been created, and this CLAUDE.md file provides the roadmap for implementation.

### Next Steps
1. Set up OpenTelemetry SDK integration
2. Create basic navigation structure
3. Implement product listing and detail screens
4. Add cart functionality
5. Integrate currency selection
6. Add checkout flow
7. Implement comprehensive telemetry instrumentation
8. Add error handling and performance monitoring
9. Create comprehensive test suite
10. Add Docker composition for local development

## Known Limitations

### React Native OpenTelemetry Ecosystem
- **Auto-instrumentation**: Limited compared to Android/iOS native
- **Native Bridge**: Some telemetry may require native module development
- **Performance**: JavaScript bridge overhead for telemetry data
- **Platform Differences**: iOS/Android specific considerations

### Workarounds
- **Manual Instrumentation**: More reliance on custom spans
- **Network Monitoring**: Custom fetch API wrappers
- **Performance Tracking**: Custom React hooks for component lifecycle
- **Error Reporting**: Enhanced error boundaries with telemetry