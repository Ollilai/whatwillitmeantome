# Security Policy

## Reporting Security Issues

If you discover a security vulnerability in this project, please report it by contacting us at whatwillitmeantome@gmail.com. We'll work with you to address the issue promptly.

## Credentials and Sensitive Data

This project requires several environment variables containing sensitive credentials:

- `DATABASE_URL`: PostgreSQL database connection string
- `MISTRAL_API_KEY`: API key for Mistral AI services

### How to Properly Handle Credentials

1. **Never commit credentials to Git**
   - Create a `.env.local` file for your development environment
   - This file is included in `.gitignore` and should never be committed

2. **Set up environment variables in your deployment platform**
   - For Vercel: Configure in the project settings under "Environment Variables"
   - For other platforms: Refer to their documentation for secure credential handling

3. **Rotate credentials if exposed**
   - If you accidentally commit credentials to a public repository, consider them compromised
   - Immediately rotate (change) any exposed credentials
   - For Supabase: Reset database passwords and API keys in the Supabase dashboard
   - For Mistral AI: Generate new API keys in the Mistral console

## Best Practices

- Regularly check git history to ensure no credentials have been accidentally committed
- Consider using a pre-commit hook to prevent committing sensitive data
- Use environment-specific variables for different deployment stages (development, staging, production)
- Review GitHub Actions workflows to ensure they handle secrets properly

## Protecting Your Fork

If you fork this repository:

1. Immediately check that `.env.local` is not in the repository
2. Set up proper environment variables in your deployment platform
3. Never commit any sensitive information to your fork 