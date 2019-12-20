# pipeline, 指令運用管線機制

send multiple commands at once, saving on round trip time (RTT).

# Pipeline in Parallel

                        Push
                         |
                       tasks
              ___________|___________
              |          |           |
             Pull       Pull        Pull
            worker     worker      worker
             Push       Push        Push
              |__________|__________|
                         |
                        Pull
                         |
                        Sink  

# Abstract, 抽象概念
 
Redis is a TCP server using the client-server model and what is called a Request/Response protocol.

This means that usually a request is accomplished with the following steps:

1. The client sends a query to the server, and reads from the socket, usually in a blocking way, for the server response.

2. The server processes the command and sends the response back to the client.

Clients and Servers are connected via a networking link. Such a link can be very fast (a loopback interface) or very slow (a connection established over the Internet with many hops between the two hosts). 

Whatever the network latency is, there is a time for the packets to travel from the client to the server, and back from the server to the client to carry the reply.
This time is called RTT (Round Trip Time). It is very easy to see how this can affect the performances when a client needs to perform many requests in a row (for instance adding many elements to the same list, or populating a database with many keys). 

For instance if the RTT time is 250 milliseconds (in the case of a very slow link over the Internet), even if the server is able to process 100k requests per second, we'll be able to process at max four requests per second.

If the interface used is a loopback interface, the RTT is much shorter (for instance my host reports 0,044 milliseconds pinging 127.0.0.1), but it is still a lot if you need to perform many writes in a row.

Fortunately there is a way to improve this use case.

# Principle, 實作方法

This is called pipelining, and is a technique widely in use since many decades. For instance many POP3 protocol implementations already supported this feature, dramatically speeding up the process of downloading new emails from the server.

A Req/Res server can be implemented so that it is able to process new requests even if the client didn't already read the old responses. 

    $ (printf "PING\r\nPING\r\nPING\r\n"; sleep 1) | nc localhost 6379
    +PONG
    +PONG
    +PONG
    
    >
    Client: INCR X
    Client: INCR X
    Client: INCR X
    Client: INCR X
    Server: 1
    Server: 2
    Server: 3
    Server: 4
    
http://redisdoc.com/string/incr.html
    
This way it is possible to send multiple commands to the server without waiting for the replies at all, and finally read the replies in a single step.

# Code, 實作代碼

     equire 'rubygems'
     require 'redis'

     def bench(descr)
         start = Time.now
         yield
         puts "#{descr} #{Time.now-start} seconds"
     end

     def without_pipelining
         r = Redis.new
         10000.times {
             r.ping
         }
     end

     def with_pipelining
         r = Redis.new
         r.pipelined {
             10000.times {
                 r.ping
             }
         }
     end

     bench("without pipelining") {
         without_pipelining
     }
     bench("with pipelining") {
         with_pipelining
     }
     
     >
     
     without pipelining 1.185238 seconds
     with pipelining 0.250783 seconds   
     
# Silly Buzy Loopback Interface, 迴環接口方式的運行速度

允許運行在同一台伺服器上的程序和服务器程序通过 TCP/IP 進行通訊。


Why it is slow even when executed in the loopback interface, when the S/C are running in the same physical machine:

After all if both the Redis process and the benchmark are running in the same box, isn't this just messages copied via memory from one place to another without any actual latency and actual networking involved?

The reason is that processes in a system are not always running, actually it is the "kernel scheduler" that let the process run, so what happens is that, for instance, the benchmark is allowed to run, reads the reply from the Redis server (related to the last command executed), and writes a new command. 

The command is now in the loopback interface buffer, but in order to be read by the server, the kernel should schedule the server process (currently blocked in a system call) to run, and so forth. 

So in practical terms the loopback interface still involves network-alike latency, because of how the kernel scheduler works.

Basically "a busy loop benchmark" is the silliest thing that can be done when metering performances in a networked server. The wise thing is just avoiding benchmarking in this way.


   
