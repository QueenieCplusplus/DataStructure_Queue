# MQ
Message Queue - functionality Middleware


                 TCP Socket => MQ Socket
                 
 
# REQ/ RES(REP)
 
                        Client App
                        
                            Req
                             |
                            Rep
                            
                           Server
                              
 
# PUB/ SUB 
 
                          Publisher
                            bind
                             |
                           update
                   __________|__________
                  |          |          |
                update    update     update
                  |          |          |
                connect   connect    connect
                
            Subscriber   Subscriber  Subscriber
  
# Queue (Linked List || Array)
 
                 Push      Push       Push
                   |         |          |
                R1.2.3      R4        R5.R6 
                   |_________|__________|
                             |
                     R1.4.5      R2.6.3
                           queue
                             |
                             |
                             |
                            Pull
 
 
# Pipeline in Parallel

https://github.com/QuinoaPy/pipeline
 
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
   
# Forwarder Proxy


                                 Publisher
                             bind tcp://192.168.55.210:5556
                                  
                           __________|__________
                          |          |          |                    
                    Subscriber   Subscriber   ExSub
                                              Proxy
                                              ExPub
                                                |
        internal network                        |
        ----------------------------            V
        external network             bind tcp://10.1.1.0:8100                                 
                                       _________|________
                                       |                 |   
                                    subscriber       subscriber
        

Code has to talk to code. Code has to be chatty, sociable, well-connected. Code has to run like the human brain, trillions of individual neurons firing off messages to each other, a massively parallel network with no central control, no single point of failure, yet able to solve immensely difficult problems. And it's no accident that the future of code looks like the human brain, because the endpoints of every network are, at some level, human brains.

If you've done any work with threads, protocols, or networks, you'll realize this is pretty much impossible. It's a dream. E

ven connecting a few programs across a few sockets is plain nasty when you start to handle real life situations. Trillions? The cost would be unimaginable. Connecting computers is so difficult that software and services to do this is a multi-billion dollar business.

For application developers, HTTP is perhaps the one solution to have been simple enough to work, but it arguably makes the problem worse by encouraging developers and architects to think in terms of big servers and thin, stupid clients.

So today people are still connecting applications using raw UDP and TCP, proprietary protocols, HTTP, and Websockets. 

It remains painful, slow, hard to scale, and essentially centralized. Distributed P2P architectures are mostly for play, not work. How many applications use Skype or Bittorrent to exchange data?

Which brings us back to the science of programming. To fix the world, we needed to do two things. 

One, to solve the general problem of "how to connect any code to any code, anywhere". 

Two, to wrap that up in the simplest possible building blocks that people could understand and use easily.

It sounds ridiculously simple. And maybe it is. That's kind of the whole point.

# QMQ, zero MQ

http://zguide.zeromq.org/page:all#header-3

 server in java
 
     package guide;

    //
    //  Hello World server in Java
    //  Binds REP socket to tcp://*:5555
    //  Expects "Hello" from client, replies with "World"
    //

    import org.zeromq.SocketType;
    import org.zeromq.ZMQ;
    import org.zeromq.ZContext;

    public class hwserver
    {
        public static void main(String[] args) throws Exception
        {
            try (ZContext context = new ZContext()) {
                // Socket to talk to clients
                ZMQ.Socket socket = context.createSocket(SocketType.REP);
                socket.bind("tcp://*:5555");

                while (!Thread.currentThread().isInterrupted()) {
                    byte[] reply = socket.recv(0);
                    System.out.println(
                        "Received " + ": [" + new String(reply, ZMQ.CHARSET) + "]"
                    );

                    String response = "world";
                    socket.send(response.getBytes(ZMQ.CHARSET), 0);

                    Thread.sleep(1000); //  Do some 'work'
                }
            }
        }
    }
    
server in ruby

    #!/usr/bin/env ruby

    require 'rubygems'
    require 'ffi-rzmq'

    context = ZMQ::Context.new(1)

    # Socket to talk to server
    puts "Connecting to hello world server…"
    requester = context.socket(ZMQ::REQ)
    requester.connect("tcp://localhost:5555")

    0.upto(9) do |request_nbr|
      puts "Sending request #{request_nbr}…"
      requester.send_string "Hello"

      reply = ''
      rc = requester.recv_string(reply)

      puts "Received reply #{request_nbr}: [#{reply}]"
    end
    
# MQTT

https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.pdf

# Rabbit MQ

https://www.rabbitmq.com/getstarted.html

# Redis MQ

https://docs.servicestack.net/redis-mq

# QMQ, zeroMQ 

http://zguide.zeromq.org/page:all#header-3



