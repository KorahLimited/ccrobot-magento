<?php

namespace Korah\CcRobot\Block;

use Magento\Framework\View\Element\Template;
use Magento\Store\Model\ScopeInterface;
use Magento\Framework\View\Element\Template\Context;

class CcrWidgetBlock extends Template
{
    protected $_template = "ccrWidget.phtml";
    
    public function __construct(
        Context $context,
        array $data = []
    ) {
        parent::__construct($context, $data);
    }

    public function getConfig($configName) 
    {
        return $this->_scopeConfig->getValue("ccrobot/$configName", ScopeInterface::SCOPE_STORES);
    }
}
