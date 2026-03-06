---
title: MPI Reference Guide
description:
author: Adam Aubry
date: '2026-03-04'
---

## Installtion

- **macOS**: `brew install open-mpi`

- **Ubuntu/WSL**: `sudo apt install openmpi-bin libopenmpi-dev`

## Workflow

**Compile**

- `mpicc program.c -o program`
- This is a wrapper for `gcc` that handles all the MPI libraries for you

**Run**

- `mpirun -np 4 ./program`
- This launches 4 independent instances of your program.

## Example

```c
#include <mpi.h>
#include <stdio.h>

int main(int argc, char** argv) {
    // - Sets up internal data structures, establishes
    // network connections (sockets, shared memory, or
    // infiniBand Links), and
    // clears communication buffers.
    //
    // - It creates the first Communicator named MPI_COMM_WORLD.
    // This is a "Global Address Book" that contains
    // every process launched in
    // this job
    //
    // - It takes the address of argc and argv
    // because many MPI implementations
    // (like Open MPI)
    // look for hidden command-line flags passed by the launcher to tell the process who
    // it neighbors are.
    MPI_Init(&argc, &argv);


    // - These functions don't actually "calculate"
    // anything; they are getters for the
    // communicator object created during MPI_Init.
    // - Every process is asigned a unique integer ID
    // (starting at 0) during startup.
    // - The function simply asks the local MPI environment,
    //   "Which entry in the address book am I?"
    int world_rank;
    MPI_Comm_rank(MPI_COMM_WORLD, &world_rank);

    // - Looks at the MPI_Comm object (the address book)
    // and returns the total number of entries
    // - It is a constant value for the life of the communicator
    int world_size;
    MPI_Comm_size(MPI_COMM_WORLD, &world_size);

    // We specifically need exactly 2 processes for this simple version
    if (world_size != 2) {
        if (world_rank == 0) printf("Error: Run with -np 2\n");
        MPI_Finalize();
        return 0;
    }

    int ping_pong_count = 0;
    int partner_rank = (world_rank + 1) % 2;

    while (ping_pong_count < 10) {
        if (world_rank == ping_pong_count % 2) {
            // Increment count and send it
            ping_pong_count++;
            MPI_Send(&ping_pong_count, 1, MPI_INT, partner_rank, 0, MPI_COMM_WORLD);
            printf("Rank %d sent ping_pong_count %d to rank %d\n",
                   world_rank, ping_pong_count, partner_rank);
        } else {
            // Wait to receive the count
            MPI_Recv(&ping_pong_count, 1, MPI_INT, partner_rank, 0, MPI_COMM_WORLD,
                     MPI_STATUS_IGNORE);
            printf("Rank %d received ping_pong_count %d from rank %d\n",
                   world_rank, ping_pong_count, partner_rank);
        }
    }

    MPI_Finalize();
    return 0;
}
```

```bash
adams-home@Adams-MacBook-Air test_scripts % mpirun -np 2 ./ping_pong
Rank 0 sent ping_pong_count 1 to rank 1
Rank 0 received ping_pong_count 2 from rank 1
Rank 0 sent ping_pong_count 3 to rank 1
Rank 0 received ping_pong_count 4 from rank 1
Rank 0 sent ping_pong_count 5 to rank 1
Rank 0 received ping_pong_count 6 from rank 1
Rank 0 sent ping_pong_count 7 to rank 1
Rank 1 received ping_pong_count 1 from rank 0
Rank 1 sent ping_pong_count 2 to rank 0
Rank 1 received ping_pong_count 3 from rank 0
Rank 1 sent ping_pong_count 4 to rank 0
Rank 1 received ping_pong_count 5 from rank 0
Rank 1 sent ping_pong_count 6 to rank 0
Rank 1 received ping_pong_count 7 from rank 0
Rank 1 sent ping_pong_count 8 to rank 0
Rank 0 received ping_pong_count 8 from rank 1
Rank 0 sent ping_pong_count 9 to rank 1
Rank 0 received ping_pong_count 10 from rank 1
Rank 1 received ping_pong_count 9 from rank 0
Rank 1 sent ping_pong_count 10 to rank 0
```

<details>
<summary> A Quick Experiment To See if the Processes are Separate</summary>

Try adding this line into the code above right
after `ping_pong_count` is initialized.

```c
    int ping_pong_count = 0;
    int partner_rank = (world_rank + 1) % 2;

    // ADD THIS HERE
    printf("Rank %d variable address: %p\n", world_rank, &ping_pong_count);

    while (ping_pong_count < 10) {
```

```bash
adams-home@Adams-MacBook-Air test_scripts % mpirun -np 2 ./ping_pong
Rank 1 variable address: 0x16b066834
Rank 0 variable address: 0x16b2ca834
Rank 0 sent ping_pong_count 1 to rank 1
Rank 1 received ping_pong_count 1 from rank 0
Rank 1 sent ping_pong_count 2 to rank 0
Rank 1 received ping_pong_count 3 from rank 0
Rank 1 sent ping_pong_count 4 to rank 0
Rank 1 received ping_pong_count 5 from rank 0
Rank 1 sent ping_pong_count 6 to rank 0
Rank 1 received ping_pong_count 7 from rank 0
Rank 1 sent ping_pong_count 8 to rank 0
Rank 1 received ping_pong_count 9 from rank 0
Rank 1 sent ping_pong_count 10 to rank 0
Rank 0 received ping_pong_count 2 from rank 1
Rank 0 sent ping_pong_count 3 to rank 1
Rank 0 received ping_pong_count 4 from rank 1
Rank 0 sent ping_pong_count 5 to rank 1
Rank 0 received ping_pong_count 6 from rank 1
Rank 0 sent ping_pong_count 7 to rank 1
Rank 0 received ping_pong_count 8 from rank 1
Rank 0 sent ping_pong_count 9 to rank 1
Rank 0 received ping_pong_count 10 from rank 1
adams-home@Adams-MacBook-Air test_scripts %
```

The difference in memeory addresse's means they are using different parts
of memory to store the `ping_pong_count` variable.

We can also

</details>

<details>
<summary> Why the print statements are out-of-order?</summary>

### Why the Prints are Out of Order

The jumbled output you see is actually proof that the processes are independent.
Each process has its own "stdout" (standard output) stream. The MPI launcher (`mpirun`) collects these two streams and redirects them to your terminal window.

Because the processes are running in parallel at nearly the same speed, the messages reach the "collection point" in a bit of a race.

- Rank 0 might finish printing its "Sent" message, but Rank 1's "Received" message might get buffered by the OS for a microsecond longer.
- This results in the "interleaving" you see where Rank 0 seems to send three things before Rank 1 prints a single "Received" line. **They are actually happening in order internally**, but the _reporting_ of those events to your screen is happening out of sync.

</details>

**Build**

```bash
mpicc ping_pong.c -o ping_pong
```

**What just happened?**

`mpicc` told your system's compiler (likely `gcc`) to find the MPI headers and link the math and communication libraries automatically. You now have an executable named
`ping_pong`

**Run**

Now, tell the MPI runtime to start two instances of this program:

```bash
mpirun -np 2 ./ping_pong
```
