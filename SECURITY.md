# Security Policy

## Supported Versions

We actively support the following versions with security updates:

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |
| < 0.1   | :x:                |

## Reporting a Vulnerability

We take security seriously and appreciate your efforts to responsibly disclose security vulnerabilities.

### How to Report

**Please do not report security vulnerabilities through public GitHub issues.**

Instead, please report security vulnerabilities by:

1. **GitHub Security Advisory**: Use GitHub's private vulnerability reporting feature
2. **Direct Message**: Contact the maintainer directly via GitHub

### What to Include

When reporting a vulnerability, please include:

- **Description**: A clear description of the vulnerability
- **Impact**: What could happen if this vulnerability is exploited
- **Reproduction**: Step-by-step instructions to reproduce the issue
- **Environment**: Node.js version, Bun version, and operating system
- **Code Sample**: Minimal reproducible example (if applicable)

### Response Timeline

We aim to respond to security reports within:

- **Initial Response**: 48 hours
- **Status Update**: 7 days
- **Resolution**: 30 days (for confirmed vulnerabilities)

### Security Considerations for Users

When running Krill Bill locally or in cloud environments:

#### General Security Best Practices

1. **Dependency Management**:

   ```bash
  # Keep dependencies updated
  bun update
  bun audit
   ```

2. **Input Validation**:

   Validate all user-provided invoice and client data at trust boundaries.

3. **Error Handling**:

   Avoid exposing internal stack traces or secrets in client-visible errors.

#### Common Security Pitfalls

- **Input Sanitization**: Sanitize all text fields before rendering or storing.
- **Dependency Vulnerabilities**: Regularly audit and update dependencies.
- **Error Information Disclosure**: Avoid leaking internals in UI and logs.
- **Resource Limits**: Enforce safe limits for file uploads and payload sizes.

#### Dependencies

Dependencies are intentionally kept minimal to reduce attack surface.

### Scope

This security policy covers:

- React App Template web application code
- Build and deployment workflows
- Public documentation and configuration

This policy does not cover:

- Third-party services and infrastructure outside this repository
- Security issues in upstream dependencies (report to the respective maintainers)

### Recognition

We appreciate security researchers and will acknowledge your contribution (with permission) in:

- Security advisory credits
- CHANGELOG.md mentions
- Hall of fame (if we create one)

Thank you for helping keep Krill Bill and its community safe.
