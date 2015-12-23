package net.consensys.keyserver.app;

import io.vertx.core.AbstractVerticle;
import io.vertx.core.eventbus.Message;
import io.vertx.core.json.JsonArray;
import io.vertx.core.json.JsonObject;
import io.vertx.ext.mongo.MongoClient;

import java.net.URI;
import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MongoVerticle extends AbstractVerticle {
	private static final JsonObject SUCCESS = new JsonObject().put("status", "success");
	private static final Logger log = LoggerFactory.getLogger(MongoVerticle.class);
	private MongoClient client;
	
	@Override
	public void start() throws Exception {
		String MONGOLAB_URI=System.getenv("MONGOLAB_URI");
		JsonObject config;
		if(MONGOLAB_URI!=null){
			config = new JsonObject().put("connection_string", MONGOLAB_URI);
			URI mongoLabUri=new URI(MONGOLAB_URI);
			config.put("db_name",mongoLabUri.getPath().substring(1));
		}else{
			config = context.config();
		}
		client = MongoClient.createShared(vertx, config);
		vertx.eventBus().consumer("vertx.mongopersistor", this::doPersistMongo);
		
		
		
		client.createCollection("keystores", res->{
			if(res.succeeded()){
				log.debug("collection keystores created");
			}else{
				log.debug("collection keystores not created");
				log.debug(res.cause().getMessage());
			}
		});
		log.debug("MongoVerticle Iniciado.");
	}

	@Override
	public void stop() throws Exception {
		client.close();
		log.debug("MongoVerticle detenido.");
	}

	private void doPersistMongo(Message<JsonObject> event) {
			JsonObject body = event.body();
			String action = body.getString("action");
			String collection = body.getString("collection");
			
			if (action == null || action.trim().equals("")) {
				replyError("El campo 'action' es requerido.", event);
				return;
			}

			if (collection == null || collection.trim().equals("")) {
				replyError("El campo 'collection' es requerido.", event);
				return;
			}
			
			log.debug("Ejecutando accion:" + action);
			if (action.trim().equals("save")) {
				JsonObject document = body.getJsonObject("document");
				client.save(collection, document, mongoEvt -> {
					if (mongoEvt.succeeded()) {
						String id = mongoEvt.result();
						log.debug("Documento guardad con exito. ID:" + id);
						event.reply(new JsonObject().put("_id", id));
					} else {
						log.debug("Error al guardar el documento.", mongoEvt.cause());
						event.fail(500, mongoEvt.cause().getMessage());
					}
				});
			} else if (action.trim().equals("find")) {
				JsonObject matcher = body.getJsonObject("matcher");
				client.find(collection, matcher, mongoEvt -> {
					if (mongoEvt.succeeded()) {
						log.debug("Documento encontrado.");
						List<JsonObject> result = mongoEvt.result();
						JsonObject response = new JsonObject();
						response.put("results", new JsonArray(result));
						response.put("matcher", matcher);
						event.reply(response);
					} else {
						log.debug("Error al buscar el documento.", mongoEvt.cause());
						event.fail(500, mongoEvt.cause().getMessage());
					}
				});
			} else if (action.trim().equals("remove")) {
				JsonObject matcher = body.getJsonObject("matcher");
				client.remove(collection, matcher, mongoEvt -> {
					if (mongoEvt.succeeded()) {
						log.debug("Documento eliminado.");
						event.reply(SUCCESS);
					} else {
						log.debug("Error al buscar el documento.", mongoEvt.cause());
						event.fail(500, mongoEvt.cause().getMessage());
					}
				});
			}
	}

	private void replyError(String msg, Message<JsonObject> event) {
		event.fail(400, msg);
		log.error(msg);
	}
}
