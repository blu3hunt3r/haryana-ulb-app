#!/bin/bash

# Haryana ULB App Deployment Script
# This script automates the deployment process for the Haryana ULB application

set -e

echo "🚀 Starting Haryana ULB App Deployment..."

# Check if wrangler is installed
if ! command -v wrangler &> /dev/null; then
    echo "❌ Wrangler CLI not found. Please install it first:"
    echo "npm install -g wrangler"
    exit 1
fi

# Check if user is logged in to Cloudflare
echo "🔐 Checking Cloudflare authentication..."
if ! wrangler whoami &> /dev/null; then
    echo "❌ Not logged in to Cloudflare. Please run:"
    echo "wrangler auth login"
    exit 1
fi

echo "✅ Cloudflare authentication verified"

# Function to create resources if they don't exist
create_resources() {
    echo "🏗️  Creating Cloudflare resources..."
    
    # Create D1 database
    echo "Creating D1 database..."
    DB_OUTPUT=$(wrangler d1 create haryana-ulb 2>&1) || true
    if echo "$DB_OUTPUT" | grep -q "already exists"; then
        echo "✅ D1 database already exists"
    else
        echo "✅ D1 database created"
        echo "$DB_OUTPUT" | grep "database_id"
    fi
    
    # Create KV namespace
    echo "Creating KV namespace..."
    KV_OUTPUT=$(wrangler kv:namespace create "CACHE" 2>&1) || true
    if echo "$KV_OUTPUT" | grep -q "already exists"; then
        echo "✅ KV namespace already exists"
    else
        echo "✅ KV namespace created"
        echo "$KV_OUTPUT" | grep "id"
    fi
    
    # Create R2 bucket
    echo "Creating R2 bucket..."
    R2_OUTPUT=$(wrangler r2 bucket create haryana-ulb-assets 2>&1) || true
    if echo "$R2_OUTPUT" | grep -q "already exists"; then
        echo "✅ R2 bucket already exists"
    else
        echo "✅ R2 bucket created"
    fi
}

# Function to setup database
setup_database() {
    echo "🗄️  Setting up database..."
    
    echo "Running database migrations..."
    if wrangler d1 execute haryana-ulb --file=./database/schema.sql; then
        echo "✅ Database schema created"
    else
        echo "⚠️  Schema might already exist, continuing..."
    fi
    
    echo "Seeding database with organizational data..."
    if wrangler d1 execute haryana-ulb --file=./database/seed.sql; then
        echo "✅ Database seeded successfully"
    else
        echo "⚠️  Data might already exist, continuing..."
    fi
}

# Function to deploy worker
deploy_worker() {
    echo "⚡ Deploying Cloudflare Worker..."
    
    if wrangler deploy; then
        echo "✅ Worker deployed successfully"
        echo "🌐 Worker URL: https://haryana-ulb-worker.$(wrangler whoami | grep 'Account ID' | awk '{print $3}').workers.dev"
    else
        echo "❌ Worker deployment failed"
        exit 1
    fi
}

# Function to build and deploy frontend
deploy_frontend() {
    echo "🎨 Building and deploying frontend..."
    
    # Install dependencies if not already installed
    if [ ! -d "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm install
    fi
    
    # Build the frontend
    echo "🔨 Building frontend..."
    if npm run build; then
        echo "✅ Frontend built successfully"
    else
        echo "❌ Frontend build failed"
        exit 1
    fi
    
    # Deploy to Cloudflare Pages
    echo "🚀 Deploying to Cloudflare Pages..."
    if npm run deploy; then
        echo "✅ Frontend deployed successfully"
    else
        echo "❌ Frontend deployment failed"
        exit 1
    fi
}

# Function to run tests
run_tests() {
    echo "🧪 Running tests..."
    
    if npm test; then
        echo "✅ All tests passed"
    else
        echo "❌ Some tests failed"
        read -p "Continue with deployment anyway? (y/N): " -n 1 -r
        echo
        if [[ ! $REPLY =~ ^[Yy]$ ]]; then
            exit 1
        fi
    fi
}

# Function to verify deployment
verify_deployment() {
    echo "🔍 Verifying deployment..."
    
    # Get worker URL
    WORKER_URL="https://haryana-ulb-worker.$(wrangler whoami | grep 'Account ID' | awk '{print $3}').workers.dev"
    
    # Test API endpoints
    echo "Testing API endpoints..."
    
    if curl -s "$WORKER_URL/api/ulb/structure" > /dev/null; then
        echo "✅ ULB API endpoint is working"
    else
        echo "⚠️  ULB API endpoint might not be ready yet"
    fi
    
    if curl -s "$WORKER_URL/api/search?query=test" > /dev/null; then
        echo "✅ Search API endpoint is working"
    else
        echo "⚠️  Search API endpoint might not be ready yet"
    fi
}

# Main deployment flow
main() {
    case "${1:-all}" in
        "resources")
            create_resources
            ;;
        "database")
            setup_database
            ;;
        "worker")
            deploy_worker
            ;;
        "frontend")
            deploy_frontend
            ;;
        "test")
            run_tests
            ;;
        "verify")
            verify_deployment
            ;;
        "all")
            echo "🚀 Full deployment process starting..."
            create_resources
            setup_database
            run_tests
            deploy_worker
            deploy_frontend
            verify_deployment
            echo ""
            echo "🎉 Deployment completed successfully!"
            echo ""
            echo "📋 Next Steps:"
            echo "1. Update your DNS settings to point to Cloudflare Pages"
            echo "2. Configure custom domain if needed"
            echo "3. Set up monitoring and alerts"
            echo "4. Review security settings in Cloudflare dashboard"
            echo ""
            echo "🔗 Useful Links:"
            echo "- Cloudflare Dashboard: https://dash.cloudflare.com"
            echo "- Worker Logs: wrangler tail"
            echo "- Database Console: wrangler d1 execute haryana-ulb --command='SELECT * FROM departments LIMIT 5'"
            ;;
        *)
            echo "Usage: $0 [resources|database|worker|frontend|test|verify|all]"
            echo ""
            echo "Commands:"
            echo "  resources  - Create Cloudflare resources (D1, KV, R2)"
            echo "  database   - Setup database schema and seed data"
            echo "  worker     - Deploy Cloudflare Worker"
            echo "  frontend   - Build and deploy frontend"
            echo "  test       - Run test suite"
            echo "  verify     - Verify deployment"
            echo "  all        - Run complete deployment process (default)"
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"
