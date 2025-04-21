#!/bin/bash

# Colors for better readability
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}MOR Accelerator GitHub Push Script${NC}"
echo -e "${BLUE}===========================================${NC}"

# Check if git is installed
if ! command -v git &> /dev/null; then
  echo -e "${RED}Error: Git is not installed.${NC}"
  exit 1
fi

# Stage all changed files
echo -e "${YELLOW}Staging all changed files...${NC}"
git add .

# Show which files will be committed
echo -e "${YELLOW}Files to be committed:${NC}"
git status

# Prompt for commit message
echo -e "${YELLOW}Enter commit message (e.g., 'Add MOR token integration and Vercel deployment files'):${NC}"
read -p "> " commit_message

if [ -z "$commit_message" ]; then
  commit_message="Add MOR token integration and Vercel deployment files"
  echo -e "${YELLOW}Using default commit message: ${commit_message}${NC}"
fi

# Commit the changes
echo -e "${YELLOW}Committing changes...${NC}"
git commit -m "$commit_message"

# Push to GitHub
echo -e "${YELLOW}Pushing to GitHub repository MyBlockcities/MOR_Accelerator_New...${NC}"
git push origin main

# Check if push was successful
if [ $? -eq 0 ]; then
  echo -e "${GREEN}Success! All changes have been pushed to GitHub.${NC}"
  echo -e "${BLUE}Repository: https://github.com/MyBlockcities/MOR_Accelerator_New${NC}"
else
  echo -e "${RED}Error: Failed to push to GitHub.${NC}"
  echo -e "${YELLOW}Please check your internet connection and GitHub credentials.${NC}"
  echo -e "${YELLOW}You may need to run 'git push origin main' manually.${NC}"
fi

echo -e "${BLUE}===========================================${NC}"
echo -e "${GREEN}You can now deploy to Vercel using the guide:${NC}"
echo -e "${BLUE}VERCEL_DEPLOYMENT_GUIDE.md${NC}"
echo -e "${BLUE}===========================================${NC}"
