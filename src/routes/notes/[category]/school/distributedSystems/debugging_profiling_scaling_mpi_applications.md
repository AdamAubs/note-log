---
title: Debugging, Profiling, and Scaling MPI Applications
description:
author: Adam Aubry
date: '2026-03-04'
---

<details>
<summary>
In MPI applications, a program may appear "stuck" or hung even if only a single rank has encountered a protocol violation. Which of the following is the <b>primary</b> reason for this behavior?

1.  MPI automatically terminates all ranks if one rank fails
2.  The library waits for a heartbeat that is only sent by rank 0.
3.  Other ranks are waiting for a message from the failing rank that will never arrive.
4.  The network hardware locks up when it detects a logic error.

</summary>

<blockquote>
<strong>Answer:</strong> <b>(3) Other ranks are waiting for a message from the failing rank that will never arrive.</b>

Because MPI communication is often blocking, if one rank exits or hits a different code path, the ranks expecting to communicate with it will sit idle indefinitely.

</blockquote>

</details>

<details>
<summary>
A common deadlock pattern occurs when a set of ranks all call <b>blocking sends</b> followed by <b>blocking receives</b>. Under what specific condition might this code actually <i>succeed</i> instead of hanging?
</summary>

<blockquote>
<strong>Answer:</strong> It only works if <b>message buffering</b> happens to save you.

If the MPI implementation has enough internal buffer space to store the outgoing message without waiting for the receiver to "post" a matching receive, the send will complete and the program will move on. If the message is too large for the buffer, it deadlocks.

</blockquote>

</details>

<br>
<details>

<summary>
Fill-in-the-blank: A <b>collective mismatch</b> often looks like the program is stuck inside a routine like <code>MPI_Bcast</code> or <code>MPI_Reduce</code>, but the actual bug is usually a _________ earlier in the code.
</summary>

<blockquote>
<strong>Answer:</strong> <b>Control flow divergence</b>.

The hang happens because different ranks took different logical paths (e.g., an <code>if/else</code> block) and are now trying to execute different collective operations that don't match up.

</blockquote>

</details>

<br>
<details>
<summary>
Code Analysis: Consider the following snippet.

```c
if (rank % 2 == 0) {
    MPI_Bcast(&value, 1, MPI_INT, 0, MPI_COMM_WORLD);
    MPI_Reduce(&value, &sum, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);
} else {
    MPI_Reduce(&value, &sum, 1, MPI_INT, MPI_SUM, 0, MPI_COMM_WORLD);
    MPI_Bcast(&value, 1, MPI_INT, 0, MPI_COMM_WORLD);
}
```

What is the likely outcome when run on 4 ranks?

</summary>

<blockquote>
<strong>Answer:</strong> The program will <b>hang/deadlock</b>.

This is a classic collective mismatch. Even though all ranks call the same two functions, they call them in a different <b>order</b>. MPI collectives are coordinated protocols; if rank 0 enters a "broadcast door" and rank 1 enters a "reduce door," they cannot synchronize.

</blockquote>

</details>
