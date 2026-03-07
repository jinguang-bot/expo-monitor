#!/bin/bash
echo "=== Expo Monitor Test Suite ==="
echo ""

BASE_URL="http://localhost:3000"

# Test 1: Home page
echo "1. Testing home page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/)
if [ "$STATUS" = "200" ]; then
  echo "   ✓ Home page OK"
else
  echo "   ✗ Home page failed (status: $STATUS)"
fi

# Test 2: Exhibitions page
echo "2. Testing exhibitions page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/exhibitions)
if [ "$STATUS" = "200" ]; then
  echo "   ✓ Exhibitions page OK"
else
  echo "   ✗ Exhibitions page failed (status: $STATUS)"
fi

# Test 3: Dashboard page
echo "3. Testing dashboard page..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/dashboard)
if [ "$STATUS" = "200" ]; then
  echo "   ✓ Dashboard page OK"
else
  echo "   ✗ Dashboard page failed (status: $STATUS)"
fi

# Test 4: API - Get all exhibitions
echo "4. Testing API - Get exhibitions..."
COUNT=$(curl -s $BASE_URL/api/exhibitions | jq 'length' 2>/dev/null)
if [ "$COUNT" -gt 0 ]; then
  echo "   ✓ API returned $COUNT exhibitions"
else
  echo "   ✗ API failed or returned 0 exhibitions"
fi

# Test 5: API - Get single exhibition
echo "5. Testing API - Get single exhibition..."
ID=$(curl -s $BASE_URL/api/exhibitions | jq -r '.[0].id' 2>/dev/null)
if [ ! -z "$ID" ] && [ "$ID" != "null" ]; then
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" $BASE_URL/api/exhibitions/$ID)
  if [ "$STATUS" = "200" ]; then
    echo "   ✓ Single exhibition API OK"
  else
    echo "   ✗ Single exhibition API failed (status: $STATUS)"
  fi
else
  echo "   ✗ Could not get exhibition ID"
fi

# Test 6: Test search
echo "6. Testing search functionality..."
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/exhibitions?search=robot")
if [ "$STATUS" = "200" ]; then
  echo "   ✓ Search functionality OK"
else
  echo "   ✗ Search failed (status: $STATUS)"
fi

echo ""
echo "=== Test Complete ==="
echo ""
echo "📊 Database Stats:"
sqlite3 /home/ubuntu/Projects/expo-monitor/prisma/dev.db "SELECT 
  '  Exhibitions: ' || COUNT(*) FROM exhibitions;
SELECT 
  '  Countries: ' || COUNT(DISTINCT country) FROM exhibitions;
SELECT 
  '  News articles: ' || COUNT(*) FROM news;"

echo ""
echo "🌐 Access the application at: http://localhost:3000"
echo "📖 View on GitHub: https://github.com/jinguang-bot/expo-monitor"
