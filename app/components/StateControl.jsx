import React from "react";

// Abstract status class
class BookingStatus {
    constructor(value) {
      this.value = value;
    }
  
    render() {
      throw new Error("Method 'render' must be implemented");
    }
  
    getStatusStyle() {
      throw new Error("Method 'getStatusStyle' must be implemented");
    }
  }
  
  // Concrete status classes
  class InProgressStatus extends BookingStatus {
    render() {
      return (
        <div className="text-white text-sm px-3 py-1 font-medium whitespace-nowrap" style={this.getStatusStyle()}>
          {this.value}
        </div>
      );
    }
  
    getStatusStyle() {
      return {
        color: "white",
        backgroundColor: "#ffce3d",
        borderRadius: "33px",
      };
    }
  }
  
  class CompletedStatus extends BookingStatus {
    render() {
      return (
        <div className="text-white text-sm px-3 py-1 font-medium whitespace-nowrap" style={this.getStatusStyle()}>
          {this.value}
        </div>
      );
    }
  
    getStatusStyle() {
      return {
        color: "white",
        backgroundColor: "#19ba42",
        borderRadius: "33px",
      };
    }
  }
  
  class CancelledStatus extends BookingStatus {
    render() {
      return (
        <div className="text-white text-sm px-3 py-1 font-medium whitespace-nowrap" style={this.getStatusStyle()}>
          {this.value}
        </div>
      );
    }
  
    getStatusStyle() {
      return {
        color: "white",
        backgroundColor: "#ff5319",
        borderRadius: "33px",
      };
    }
  }
  
  class DefaultStatus extends BookingStatus {
    render() {
      return (
        <div className="text-white text-sm px-3 py-1 font-medium whitespace-nowrap" style={this.getStatusStyle()}>
          {this.value}
        </div>
      );
    }
  
    getStatusStyle() {
      return {
        color: "white",
        backgroundColor: "gray",
        borderRadius: "33px",
      };
    }
  }

  export { InProgressStatus, CompletedStatus, CancelledStatus, DefaultStatus };
