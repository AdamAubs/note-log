---
title: Communication Costs and Collective Operations
description: Probabilistic queuing models, communication cost analysis, and collective operations in distributed systems.
author: Adam Aubry
date: '2026-03-04'
---

## Probabilistic Queuing Models

**Concept:** Real-world message passing is non-deterministic (noisy). Models must treat variables as **random distributions**, not fixed constants.

- **Why use them?** To predict **tail latency** (95th/99th percentiles) and identify bottlenecks before they cause system failure.
- **Key Components for Translation:**
  - **Customers:** The flow units (e.g., MPI messages, Akka requests).
  - **Customer Classes:** Grouping by message type (e.g., separate classes for tiny control messages vs. large data blocks).
  - **Service Centers:** Anywhere waiting occurs (e.g., Actor mailboxes, NIC injection queues, CPU overhead).
  - **Arrival Models:**
    - **Open Systems:** External load (clients).
    - **Closed Systems:** Fixed population (iterative algorithms).

### Little’s Law

**The Equation:**

$L=λ×W$

| **Variable**  | **Definition**                  | **Quick Reference**                                |
| ------------- | ------------------------------- | -------------------------------------------------- |
| **$L$**       | Average number of customers     | "How many messages are in the mailbox/system?"     |
| **$\lambda$** | Average arrival/throughput rate | "How many requests/sec are we completing?"         |
| **$W$**       | Average time in system          | "What is the end-to-end latency (Wait + Service)?" |

**Critical Assumption:**

- **Steady State:** The system must be stable (not in "runaway overload").
- **Stability:** If arrivals > service capacity, L grows to infinity, and the law breaks.
- **Boundary Effects:** As observation time T increases, the error from "in-flight" messages at the start/end becomes negligible.

### The "Wall Clock" Trap (Conceptual)

**Scenario:** A system has a concurrency level (L) of **10**. Each customer spends **2 seconds** (W) in the system. The system runs for a total of **60 seconds** of wall-clock time.

- **Question A:** What is the total "Customer Time" accumulated?
  - **Formula:** L×Total Time
  - **Calculation:** 10×60=600 customer-seconds.
- **Question B:** How many total customers completed their work during those 60 seconds?
  - **Steps:** 1. Find λ: λ=L/W=10/2=5 customers/sec.
  2. Total Customers =λ×Total Time=5×60=300 customers.
- **Answer:** **600 customer-seconds** and **300 total customers**.
- **Exam Insight:** If the question asks for "total customer time," multiply the occupancy (L) by the duration. If it asks for "total completions," you must find the rate (λ) first.

### The P2P (Point-to-Point) Cost Model

$$
T(n)=α+βn
$$

| **Variable** | **Name**        | **Description**                                           | **Exam Context**                     |
| ------------ | --------------- | --------------------------------------------------------- | ------------------------------------ |
| **$T(n)$**   | Total Time      | Total time to send/receive message of size $n$.           | The "Latency" of a single transfer.  |
| **$n$**      | Message Size    | Number of bytes or units being sent.                      | Usually given in Bytes, KB, or MB.   |
| **$\alpha$** | Startup/Latency | Fixed cost: software overhead, buffer copies, NIC delays. | Paid even if message is 0 bytes.     |
| **$\beta$**  | Time per Byte   | Inverse of Bandwidth ($1 / \text{Bandwidth}$).            | Represents wire speed/transfer rate. |

**Dominance**

In an exam, you may be asked **"Which network is better for this workload?"** You must identify if you are **Latency-Bound** or **Bandwidth-Bound**.

- **Small n (Latency Dominated):** If n is tiny, α is much larger than βn.
  - _Decision:_ Choose the network with the lowest α. Bandwidth doesn't matter here.
- **Large n (Bandwidth Dominated):** If n is huge, βn is much larger than α.
  - _Decision:_ Choose the network with the lowest β (highest bandwidth). Startup cost is negligible here.

### Example Problems

**Simple Prediction**

**Scenario:** A network has a startup latency (α) of **50 μs** and a bandwidth of **1 GB/s**.

- **Question:** How long to send a **1 MB** file?
- **Steps:**
  1. Convert units! Bandwidth = 1,000 MB/s. So β=1/1,000=0.001 s/MB (or 1 ms/MB).
  2. α=0.00005 s.
  3. T=0.00005+(0.001×1 MB)=0.00105 s.
- **Answer:** **1.05 ms**.

### Comparing Networks

**Scenario:**

- Network 1: $α=10μs,β=0.5μs/byte$
- Network 2: $α=100μs,β=0.1μs/byte$
- **Question:** Which network is faster for a 1 KB (1024 bytes) message?
- **Calc 1:** 10+(0.5×1024)=10+512=522μs
- **Calc 2:** 100+(0.1×1024)=100+102.4=202.4μs
- **Answer:** **Network 2** is faster for this size, even though its startup cost is 10× higher.

## The Hockney Model

**Concept:** A refinement of the α/β model focusing on measured "sustained" rates rather than theoretical maximums.

$$
T(n)=t0+\frac{n}{R}
$$

| **Variable** | **Definition**      | **Quick Reference**                                                     |
| ------------ | ------------------- | ----------------------------------------------------------------------- |
| **$t_0$**    | Startup Time        | Equivalent to $\alpha$. Fixed software/hardware overhead.               |
| **$R$**      | Sustained Data Rate | Equivalent to $1/\beta$. Measured bandwidth for specific message sizes. |

## The Crossover Size (n∗)

It is the message size where the cost of "starting up" equals the cost of "moving bytes.”

- **Formula:** $n∗=t0×R$

**Rule of Thumb:**

- If $n < n^*$: You are **Latency Bound**. (Fix: Batch small messages).
- If $n > n^*$: You are **Bandwidth Bound**. (Fix: Move fewer bytes or use better compression).

### Solving for Crossover

**Scenario:** A system has t0=20μs and R=4 GB/s.

- **Question:** What is the crossover message size?
- **Steps:** 20×10−6 seconds×4×109 bytes/second.
- **Answer:** 80,000 bytes≈78 KiB.

## The LogP Family of Models

**Concept:** Models the fact that processors get busy with communication (o) and networks have a speed limit for injecting new messages (g).

### LogP Parameters (Small Messages)

- **L (Latency):** Time a small message spends in the network.
- **o (Overhead):** Time the CPU is "busy" and cannot do other work while sending/receiving.
- **g (Gap):** Minimum time between consecutive message injections (the inverse of the message rate).
- **P (Processors):** Number of nodes.

**Streaming Model Formula (m small messages):**

$$
Tstream(m)≈L+2o+(m−1)g
$$

LogGP (Large Messages)

$$
Tlong(n)≈L+2o+nG
$$

| **Bottleneck**              | **Visible Symptom**                                            | **Optimization Strategy**                                                |
| --------------------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------ |
| **Gap ($g$) limited**       | Mailboxes grow; throughput stalls despite low CPU usage.       | **Batching/Coalescing:** Send fewer, larger envelopes.                   |
| **Overhead ($o$) limited**  | CPU is at 100% but mostly inside communication libraries.      | **Non-blocking Ops:** Overlap communication with computation.            |
| **Latency ($L$) limited**   | Chatty request-reply patterns are slow; high wait times.       | **Protocol Redesign:** Reduce round-trips; push data instead of pulling. |
| **Bandwidth ($G$) limited** | Large transfers take exactly as long as the wire speed allows. | **Data Layout:** Use contiguous buffers; reduce payload size.            |

## BSP: The Bulk Synchronous Parallel Model

**Concept:** A holistic model that accounts for the fact that a program is a cycle of calculating, talking, and waiting.

### The Superstep

A parallel program is divided into "supersteps." Each contains:

1. **Local Computation:** Processes work independently on local data.
2. **Communication:** Processes exchange data (sends/receives).
3. **Barrier Synchronization:** Everyone waits for the slowest person to finish.

**The BSP Cost Formula:**

$$
Tsuperstep=w+(g⋅h)+L
$$

| **Term** | **Definition**              | **Exam "Catch"**                                              |
| -------- | --------------------------- | ------------------------------------------------------------- |
| **$w$**  | Max local computation time  | The **slowest** processor determines $w$.                     |
| **$g$**  | Communication gap           | Time per word (similar to $\beta$ or $G$).                    |
| **$h$**  | Max "traffic" per processor | The max number of words **sent OR received** by any one node. |
| **$L$**  | Barrier/Latency cost        | The fixed cost of the synchronization hardware/software.      |

## Core Collective Patterns

| **Pattern**   | **Input State**                      | **Output State**                              |
| ------------- | ------------------------------------ | --------------------------------------------- |
| **Broadcast** | Root has data $D$.                   | **All** processes have data $D$.              |
| **Scatter**   | Root has data $[d_0, d_1, ... d_p]$. | Each $P_i$ has their specific piece $d_i$.    |
| **Gather**    | Each $P_i$ has a piece $d_i$.        | Root has the full list $[d_0, d_1, ... d_p]$. |
| **Reduce**    | Each $P_i$ has a value $V_i$.        | Root has result of $op(V_0, V_1, ... V_p)$.   |

### Naive vs. Collective Logic

**Scenario:** You are using 1,000 processors (P=1000). Startup latency α is high.

**Question:** Why is a tree-based broadcast better than a naive loop of sends?

**Answer:** The naive version has a cost of 999⋅α. A tree-based broadcast (which we'll see in the next section) uses concurrency to reduce this to ≈log2(1000)⋅α≈10⋅α.

## Contention and Hot Spots

- **Hot Spot:** A specific link or node that is overwhelmed by traffic, causing latency to skyrocket far beyond the base α prediction.
- **The Fix:**

  **Ring Algorithms:** Spread traffic so each link is only used by two neighbors (bandwidth efficient).

- **Topology Awareness:** Mapping communicating processes to nodes that are physically close to each other.

## Shipping Functions vs. Shipping Data

**The Concept:** Instead of pulling **GigaBytes** of data to your code, send a **KiloByte** of code to the data.

### The Trade-off

You must be able to choose between two plans for the exam:

1. **Data Shipping (Tdata):** Move data partition → Compute node.
   - Tdata=Tnet(size of data)+Tcomp(at compute node)
2. **Function Shipping (Tfunc):** Move function → Data node.
   - Tfunc=Tnet(size of function)+Tcomp(at data node)+Tnet(size of results)

### Decision Logic:

> **Choose Function Shipping if:** The cost of moving the data is significantly higher than the cost of moving the function + the results.

**Benefits:**

- **Shrinks the β⋅n term:** Massive reduction in bytes moved.
- **Locality:** Keeps data in local cache/RAM, avoiding expensive network copies.
- **Scalability:** Work is spread out across all data nodes rather than concentrated on one "Master" node.
