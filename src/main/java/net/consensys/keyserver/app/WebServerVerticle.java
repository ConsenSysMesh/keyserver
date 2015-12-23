package net.consensys.keyserver.app;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.http.HttpHeaders;
import io.vertx.core.http.HttpMethod;
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
		
		router.get("/status").handler(handle("app.status"));
		
		
		//Static
		router.route("/*").handler(StaticHandler.create());

		String portStr = System.getProperty("port")!=null ? System.getProperty("port") : "8080";
		vertx.createHttpServer().requestHandler(router::accept).listen(Integer.parseInt(portStr));
		log.info("Listening on port:"+portStr);
	}
	
	
	
	private Handler<RoutingContext> handle(String address) {
		return context -> {
			log.debug("handle:" + address);
			String digitalAsset = context.request().getParam("digitalAsset");
			String blockchain = context.request().getParam("blockchain");
			HttpServerResponse response = context.response();
			try {
				JsonObject body;
				try {
					body = context.getBodyAsJson();
				} catch (DecodeException e) {
					log.warn("Body not json. Message:" + e.getMessage());
					body = new JsonObject();
				}

				eb.send(address, body, message -> {
			    	 if(message.succeeded()){
			    		 JsonObject status = (JsonObject) message.result().body();
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