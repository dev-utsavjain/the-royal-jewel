package server

import (
	"imagine_backend/internal/handler"
	v1 "imagine_backend/internal/handler/v1"
	"imagine_backend/internal/middleware"

	"github.com/gin-gonic/gin"
)

func RegisterRoutes(r *gin.Engine) {
	api := r.Group("/api")
	{
		api.GET("/health", handler.HealthCheck)

		// Public CMS content
		api.GET("/rooms", handler.ListRooms)
		api.GET("/rooms/:slug", handler.GetRoom)

		// Public: lead capture (contact / booking) + image serving
		api.POST("/leads", handler.CreateLead)
		api.GET("/images/:id", handler.GetImage)

		// Admin auth
		api.POST("/admin/login", handler.Login)

		// Admin CMS — JWT protected
		admin := api.Group("/admin")
		admin.Use(middleware.AuthMiddleware())
		{
			admin.POST("/rooms", handler.CreateRoom)
			admin.PUT("/rooms/:id", handler.UpdateRoom)
			admin.DELETE("/rooms/:id", handler.DeleteRoom)

			admin.GET("/leads", handler.ListLeads)
			admin.PATCH("/leads/:id", handler.UpdateLeadStatus)
			admin.DELETE("/leads/:id", handler.DeleteLead)

			admin.POST("/images", handler.UploadImage)
		}
	}

	// RAG proxy — consumed by imagine.bo-chat-widget.js
	v1Group := r.Group("/v1")
	{
		v1Group.GET("/kb", v1.ListKBs)
		v1Group.POST("/sessions", v1.CreateSession)
		v1Group.GET("/sessions", v1.ListSessions)
		v1Group.GET("/sessions/:id", v1.GetSessionHistory)
		v1Group.POST("/query", v1.Query)
	}
}
