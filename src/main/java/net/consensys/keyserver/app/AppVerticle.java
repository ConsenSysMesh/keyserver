package net.consensys.keyserver.app;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.DeploymentOptions;
import io.vertx.core.Vertx;
import io.vertx.core.buffer.Buffer;
import io.vertx.core.json.JsonObject;

import java.util.ArrayList;
import java.util.List;

import net.consensys.keyserver.api.StatusVerticle;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class AppVerticle extends AbstractVerticle {
	private static final Logger log = LoggerFactory.getLogger(AppVerticle.class);
	private static List<Class<? extends AbstractVerticle>> deploy = new ArrayList<Class<? extends AbstractVerticle>>();
	
	static {
		deploy.add(WebServerVerticle.class);
		deploy.add(StatusVerticle.class);
		deploy.add(MongoVerticle.class);
	}
	
	public static void main(String[] args) {
		 Vertx.vertx().deployVerticle(AppVerticle.class.getName());
	}
	
	public void start(){
		log.info("Starting AppVerticle");
		Buffer buffer = vertx.fileSystem().readFileBlocking("config.json");
		JsonObject config = new JsonObject(buffer.toString());
		for (Class<? extends AbstractVerticle> entry : deploy) {
			DeploymentOptions options = new DeploymentOptions().setConfig(config.getJsonObject(entry.getSimpleName()));
			vertx.deployVerticle(entry.getName(), options, event -> {
				if(event.succeeded()){
					log.debug(entry.getName()+" deployed");
				}else{
					log.error(entry.getName()+" not deployed", event.cause());
				}
			});
		}
	}
}
