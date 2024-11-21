const app = Vue.createApp({
  data() {
    return {
      pendingOrders: [],
      preparingOrders: [],
      selectedOrder: null,
      establishmentCode: "N9KN8J", // código do estabelecimento
    };
  },
  methods: {
    translateStatus(status) {
      const statusMap = {
        waiting_confirmation: "Aguardando Confirmação",
        in_preparation: "Em Preparo",
        ready: "Pronto",
      };
      return statusMap[status] || status;
    },

    async fetchOrders() {
      try {
        const responsePending = await fetch(
          `http://localhost:3000/api/v1/establishments/${this.establishmentCode}/orders?status=waiting_confirmation`
        );
        if (!responsePending.ok) {
          throw new Error("Erro ao buscar os pedidos");
        }
        const dataPending  = await responsePending.json();
        this.pendingOrders = dataPending.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

        const responsePreparing = await fetch(
          `http://localhost:3000/api/v1/establishments/${this.establishmentCode}/orders?status=in_preparation`
        );
        if (!responsePreparing.ok) {
          throw new Error("Erro ao buscar pedidos em preparo");
        }
        const dataPreparing = await responsePreparing.json();
        this.preparingOrders = dataPreparing.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );

      } catch (error) {
        console.error("Erro ao buscar pedidos:", error);
      }
    },

    formatDate(dateString) {
      const options = {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      };
      return new Date(dateString).toLocaleString("pt-BR", options);
    },

    async selectOrder(order) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/establishments/${this.establishmentCode}/orders/${order.order_code}`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar detalhes do pedido");
        }
        const data = await response.json();
        this.selectedOrder = data;
      } catch (error) {
        console.error("Erro ao buscar detalhes do pedido:", error);
      }
    },

    clearSelection() {
      this.selectedOrder = null;
      this.fetchOrders();
    },

    async acceptOrder(order) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/establishments/${this.establishmentCode}/orders/${order.order_code}`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao aceitar o pedido");
        }

        const updatedOrder = await response.json();
        this.selectedOrder = updatedOrder;
        alert("Pedido aceito com sucesso!");
      } catch (error) {
        console.error("Erro ao aceitar o pedido:", error);
        alert("Erro ao aceitar o pedido. Tente novamente.");
      }
    },

    async markAsReady(order) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/establishments/${this.establishmentCode}/orders/${order.order_code}`,
          {
            method: "PATCH",
          }
        );
        if (!response.ok) {
          throw new Error("Erro ao marcar o pedido como pronto");
        }

        const updatedOrder = await response.json();
        this.selectedOrder = updatedOrder;
        alert("Pedido marcado como pronto!");
      } catch (error) {
        console.error("Erro ao marcar o pedido como pronto:", error);
        alert("Erro ao marcar o pedido como pronto. Tente novamente.");
      }
    },

    async cancelOrder(order) {
      const reason = prompt("Informe o motivo do cancelamento:");
      if (!reason) {
        alert("Motivo do cancelamento é obrigatório.");
        return;
      }
    
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/establishments/${this.establishmentCode}/orders/${order.order_code}/cancel`,
          {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ reason }),
          }
        );
    
        if (!response.ok) {
          throw new Error("Erro ao cancelar o pedido");
        }
    
        const updatedOrder = await response.json();
        this.selectedOrder = updatedOrder;
        alert("Pedido cancelado com sucesso!");
      } catch (error) {
        console.error("Erro ao cancelar o pedido:", error);
        alert("Erro ao cancelar o pedido. Tente novamente.");
      }
    },
  },
  created() {
    this.fetchOrders();
  },
});

app.mount("#app");
