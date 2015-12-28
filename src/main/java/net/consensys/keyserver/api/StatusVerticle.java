package net.consensys.keyserver.api;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.Handler;
import io.vertx.core.eventbus.EventBus;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class StatusVerticle extends AbstractVerticle {
	
	private static final Logger log = LoggerFactory.getLogger(StatusVerticle.class);
	private EventBus eb;
	
	@Override
	public void start() {
		 eb = vertx.eventBus();
		 eb.consumer("app.status",doStatus());
		 log.info("Status Verticle ok");
	}
	
	private Handler<Message<JsonObject>> doStatus() {
		return new Handler<Message<JsonObject>>(){
			@Override
			public void handle(Message<JsonObject> event) {
				JsonObject resp = new JsonObject();
				resp.put("app", "ok");
				event.reply(resp);
			}
			
		};
	}

}
