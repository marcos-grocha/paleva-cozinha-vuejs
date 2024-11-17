const app = Vue.createApp({
  data() {
    return {
      orders: [],
      selectedOrder: null,
      establishmentCode: "N9KN8J", // código do estabelecimento
    };
  },
  methods: {
    async fetchPendingOrders() {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/establishments/${this.establishmentCode}/orders?status=waiting_confirmation`
        );
        if (!response.ok) {
          throw new Error("Erro ao buscar os pedidos");
        }
        const data = await response.json();
        this.orders = data.sort(
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
    },
  },
  created() {
    this.fetchPendingOrders();
  },
});

app.mount("#app");