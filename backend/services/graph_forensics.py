import networkx as nx
from typing import Dict, Any, List
from models.schemas import Complaint, Prediction

class GraphForensicsService:
    def __init__(self):
        self.global_graph = nx.DiGraph()

    def add_complaint_to_graph(self, complaint: Complaint, prediction: Prediction):
        """Adds victim, layered mule hops, and predicted cashout ATM to the directed graph."""
        v_node = f"VICTIM_{complaint.id}"
        self.global_graph.add_node(
            v_node,
            label=f"Victim: {complaint.complainant_name}",
            node_type="VICTIM",
            account=complaint.victim_account,
            bank=complaint.victim_bank,
            amount=complaint.fraud_amount,
            city=complaint.complainant_city
        )

        prev_node = v_node
        for hop in complaint.layer_hops:
            mule_node = f"MULE_L{hop.layer}_{hop.to_account[-4:]}"
            self.global_graph.add_node(
                mule_node,
                label=f"Layer {hop.layer} Mule ({hop.to_bank})",
                node_type=f"MULE_L{hop.layer}",
                account=hop.to_account,
                bank=hop.to_bank,
                ifsc=hop.ifsc,
                amount=hop.amount,
                status=hop.status
            )
            self.global_graph.add_edge(
                prev_node,
                mule_node,
                amount=hop.amount,
                utr=hop.utr,
                timestamp=hop.timestamp,
                status=hop.status
            )
            prev_node = mule_node

        # Add Predicted ATM Cash-Out Node
        atm = prediction.predicted_target_atm
        atm_node = f"ATM_{atm.id}"
        self.global_graph.add_node(
            atm_node,
            label=f"Forecasted Cash-Out: {atm.name}",
            node_type="ATM_TARGET",
            atm_id=atm.id,
            bank=atm.bank,
            pincode=atm.pincode,
            eta_minutes=prediction.eta_minutes,
            confidence=prediction.confidence_score,
            status=prediction.intervention_status.value
        )
        self.global_graph.add_edge(
            prev_node,
            atm_node,
            amount=prediction.predicted_amount_to_withdraw,
            eta=f"{prediction.eta_minutes} mins",
            type="PREDICTED_WITHDRAWAL",
            status="PENDING_INTERCEPTION"
        )

    def get_complaint_subgraph(self, complaint_id: str) -> Dict[str, Any]:
        """Returns JSON-serializable nodes and edges for a specific complaint."""
        v_node = f"VICTIM_{complaint_id}"
        if v_node not in self.global_graph:
            return {"nodes": [], "edges": [], "summary": {}}

        # Find reachable nodes (downstream money flow)
        reachable = nx.descendants(self.global_graph, v_node)
        all_nodes = {v_node} | reachable

        subgraph = self.global_graph.subgraph(all_nodes)

        nodes_list = []
        for n, attrs in subgraph.nodes(data=True):
            nodes_list.append({
                "id": n,
                **attrs
            })

        edges_list = []
        for u, v, attrs in subgraph.edges(data=True):
            edges_list.append({
                "from": u,
                "to": v,
                **attrs
            })

        total_amount = self.global_graph.nodes[v_node].get("amount", 0.0)
        layer_count = len([n for n in nodes_list if "MULE" in n.get("node_type", "")])

        return {
            "complaint_id": complaint_id,
            "nodes": nodes_list,
            "edges": edges_list,
            "summary": {
                "total_stolen": total_amount,
                "layer_depth": layer_count,
                "mule_hops": len(edges_list) - 1,
                "target_atm_id": next((n["id"] for n in nodes_list if n.get("node_type") == "ATM_TARGET"), None)
            }
        }
