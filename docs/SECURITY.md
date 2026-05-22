# Security and Public-Repository Checklist

This repository is public. Keep it useful without leaking private network state.

## Never commit

- Subscription URLs or provider tokens
- Proxy node names that reveal private providers or private hosts
- Certificates, CA passwords, private keys, or exported profiles containing secrets
- Router, phone, Mac, or LAN-specific credentials
- Private DNS, dashboard, or admin endpoints that should not be public
- Local debug dumps containing account identifiers, cookies, authorization headers, or device IDs

## Safe public placeholders

Use placeholders such as:

```text
policy-path=请替换为你自己的Surge订阅地址
```

Public configs should remain importable after the user supplies their own subscription or private local values.

## Before pushing

Run a quick scan for common secret-looking strings:

```bash
grep -RInE 'token|secret|password|passwd|authorization|bearer|api[_-]?key|subscribe|subscription|client_secret|private[_-]?key' \
  --exclude-dir=.git \
  --exclude='SECURITY.md' \
  .
```

Review matches manually. Some terms are expected in documentation; raw credentials are not.

## Public module boundaries

Some modules rely on MITM, rewrite, or client-side behavior. Document prerequisites clearly and avoid implying that modules provide guaranteed access to third-party services. Public descriptions should describe technical behavior, compatibility limits, and user responsibility.
