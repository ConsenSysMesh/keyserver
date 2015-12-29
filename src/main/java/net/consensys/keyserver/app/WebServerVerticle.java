package net.consensys.keyserver.app;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.http.HttpMethod;
import io.vertx.core.http.HttpServerRequest;
import io.vertx.core.http.HttpServerResponse;
import io.vertx.core.json.DecodeException;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.web.Router;
import io.vertx.ext.web.RoutingContext;
import io.vertx.ext.web.handler.BodyHandler;
import io.vertx.ext.web.handler.CookieHandler;
import io.vertx.ext.web.handler.CorsHandler;
import io.vertx.ext.web.handler.StaticHandler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class WebServerVerticle extends AbstractVerticle {
	private static final Logger log = LoggerFactory.getLogger(WebServerVerticle.class);
	Router router = Router.router(vertx);
	private EventBus eb;

	@Override
	public void start() {
		eb = vertx.eventBus();
		Router router = Router.router(vertx);
		
		router.route().handler(
				CorsHandler.create("*")
					.allowCredentials(true)
					.allowedHeader(HttpHeaders.AUTHORIZATION.toString())
					.allowedMethod(HttpMethod.OPTIONS)
					.allowedMethod(HttpMethod.GET)
					.allowedMethod(HttpMethod.POST)
		);
		router.route().handler(CookieHandler.create());
		router.route().handler(BodyHandler.create());
		router.route().handler(extractToken());
		
		router.get("/status").handler(handle("app.status"));
		
		//API v0
		router.get("/api/v0/keystore/:id").handler(handle("keystore.get"));
		router.post("/api/v0/keystore/:id").handler(handle("keystore.post"));
		router.put("/api/v0/keystore/:id").handler(handle("keystore.put"));
		router.delete("/api/v0/keystore/:id").handler(handle("keystore.delete"));
		
		//Static
		router.route("/*").handler(StaticHandler.create());

		String portStr = System.getProperty("port")!=null ? System.getProperty("port") : "8080";
		vertx.createHttpServer().requestHandler(router::accept).listen(Integer.parseInt(portStr));
		log.info("Listening on port:"+portStr);
	}
	
	private Handler<RoutingContext> extractToken() {
		return routingContext -> {
			HttpServerRequest request = routingContext.request();
			String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
			if(authHeader!=null && authHeader.startsWith("Bearer ")){
				request.params().add("token", authHeader.replace("Bearer ", ""));
			}
			routingContext.next();
		};	
	} 
	
	
	private Handler<RoutingContext> handle(String address) {
		return context -> {
			log.debug("handle:" + address);
			JsonObject req=new JsonObject();

			String id = context.request().getParam("id");
			if(id!=null) req.put("id", id);
			
			String token = context.request().getParam("token");
			if(token!=null) req.put("token", token);

			HttpServerResponse response = context.response();
			try {
				
				try {
					if(!context.getBodyAsString().equals("")){
						req.put("requestBody",context.getBodyAsJson());
					}
				} catch (DecodeException e) {
					log.warn("Body not json. Message:" + e.getMessage());
					sendError(400,"body not JSON", response);
					return;
				}
				
				

				eb.send(address, req, message -> {
			    	 if(message.succeeded()){
			    		 JsonObject status = (JsonObject) message.result().body();
			    		 if("error".equals(status.getString("status"))){
			    			 response.setStatusCode(500);
			    		 }
			    		 if("fail".equals(status.getString("status"))){
			    			 response.setStatusCode(400);
			    		 }
			    		 response.putHeader(HttpHeaders.CONTENT_TYPE, "application/json")
			    		 .end(status.encode());
			    	 }else{
			    		 log.error("Address:" + address, message.cause());
			    		 sendError(500, response);
			    	 }
			    });
			} catch (Exception e) {
				log.error(address, e);
				sendError(500, e.getMessage(), response);
			}
		};
	}
	
	private void sendError(int statusCode, HttpServerResponse response) {
		sendError(statusCode,null,response);
	}

	private void sendError(int statusCode, String message, HttpServerResponse response) {
		response.setStatusCode(statusCode).end(message);
	}
}