#!/bin/bash
set -e

echo "🚀 Starting integration tests..."

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
  exit 1
fi

# Start test database
echo -e "${YELLOW}📦 Starting test database...${NC}"
docker-compose -f docker-compose.test.yml up -d

# Wait for database to be ready
echo -e "${YELLOW}⏳ Waiting for database to be ready...${NC}"
timeout=30
counter=0
until docker-compose -f docker-compose.test.yml exec -T postgres-test pg_isready -U postgres > /dev/null 2>&1; do
  counter=$((counter + 1))
  if [ $counter -gt $timeout ]; then
    echo -e "${RED}❌ Database did not start in time${NC}"
    docker-compose -f docker-compose.test.yml logs postgres-test
    docker-compose -f docker-compose.test.yml down
    exit 1
  fi
  echo -e "${YELLOW}Waiting... ($counter/$timeout)${NC}"
  sleep 1
done

echo -e "${GREEN}✅ Database is ready${NC}"

# Run migrations
echo -e "${YELLOW}🔧 Running migrations...${NC}"
export DATABASE_URL="postgresql://postgres:postgres@localhost:5433/goodfood_test?schema=public"
pnpm prisma migrate deploy

# Run integration tests
echo -e "${YELLOW}🧪 Running integration tests...${NC}"
if pnpm vitest run --config vitest.integration.config.ts; then
  echo -e "${GREEN}✅ All integration tests passed!${NC}"
  TEST_EXIT_CODE=0
else
  echo -e "${RED}❌ Some integration tests failed${NC}"
  TEST_EXIT_CODE=1
fi

# Cleanup
echo -e "${YELLOW}🧹 Cleaning up...${NC}"
docker-compose -f docker-compose.test.yml down -v

exit $TEST_EXIT_CODE
