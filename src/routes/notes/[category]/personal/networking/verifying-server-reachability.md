---
title: Verifying Server Reachability
description: Walking through what VLANs are as a complete novice.
author: Adam Aubry
date: '2025-08-30'
---

<script>
  import { base } from '$app/paths';
</script>

### The Scenario

You try to access the Proxmox Web GUI (usually `https://192.168.1.2:8006`), but the browser says "Site cannot be reached." You haven’t tried accessing the server yet from the computer your are currently using, and you know that the server is plugged in and was working on your last computer.

<details>
<summary>Which OSI (Open Systems Interconnection) layer should you check?</summary>

<img src="{base}/networking/OSI_model_1.png" alt="OSI_model_1" width="1000" />

</details>
